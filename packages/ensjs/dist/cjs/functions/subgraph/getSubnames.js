"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_request_1 = require("graphql-request");
const subgraph_1 = require("../../errors/subgraph");
const consts_1 = require("../../utils/consts");
const normalise_1 = require("../../utils/normalise");
const client_1 = require("./client");
const filters_1 = require("./filters");
const fragments_1 = require("./fragments");
const utils_1 = require("./utils");
const getOrderByFilter = ({ orderBy, orderDirection, previousPage, }) => {
    const lastDomain = previousPage[previousPage.length - 1];
    const operator = orderDirection === 'asc' ? 'gt' : 'lt';
    switch (orderBy) {
        case 'expiryDate': {
            return (0, filters_1.getExpiryDateOrderFilter)({
                lastDomain,
                orderDirection,
            });
        }
        case 'name': {
            return {
                [`name_${operator}`]: lastDomain.name ?? '',
            };
        }
        case 'labelName': {
            return {
                [`labelName_${operator}`]: lastDomain.labelName ?? '',
            };
        }
        case 'createdAt': {
            return (0, filters_1.getCreatedAtOrderFilter)({ lastDomain, orderDirection });
        }
        default:
            throw new subgraph_1.InvalidOrderByError({
                orderBy: orderBy || '<no orderBy provided>',
                supportedOrderBys: ['expiryDate', 'name', 'labelName', 'createdAt'],
            });
    }
};
const getSubnames = async (client, { name, searchString, allowExpired = false, allowDeleted = false, orderBy = 'name', orderDirection = 'asc', pageSize = 100, previousPage, }) => {
    const subgraphClient = (0, client_1.createSubgraphClient)({ client });
    const whereFilters = [];
    if (previousPage?.length) {
        whereFilters.push(getOrderByFilter({
            orderBy,
            orderDirection,
            previousPage,
        }));
    }
    if (!allowExpired) {
        whereFilters.push({
            or: [
                { expiryDate_gt: `${Math.floor(Date.now() / 1000)}` },
                { expiryDate: null },
            ],
        });
    }
    if (!allowDeleted) {
        whereFilters.push({
            or: [
                {
                    owner_not: consts_1.EMPTY_ADDRESS,
                },
                {
                    resolver_not: null,
                },
                ...(name.toLowerCase() === 'eth'
                    ? [
                        {
                            registrant_not: consts_1.EMPTY_ADDRESS,
                        },
                    ]
                    : []),
            ],
        });
    }
    if (searchString) {
        whereFilters.push({
            labelName_contains: searchString,
        });
    }
    let whereFilter = {};
    if (whereFilters.length > 1) {
        whereFilter = {
            and: whereFilters,
        };
    }
    else if (whereFilters.length === 1) {
        ;
        [whereFilter] = whereFilters;
    }
    const query = (0, graphql_request_1.gql) `
    query getSubnames(
      $id: String!
      $orderBy: Domain_orderBy
      $orderDirection: OrderDirection
      $whereFilter: Domain_filter
      $first: Int
    ) {
      domain(id: $id) {
        subdomains(
          orderBy: $orderBy
          orderDirection: $orderDirection
          first: $first
          where: $whereFilter
        ) {
          ...DomainDetailsWithoutParent
          registration {
            ...RegistrationDetails
          }
          wrappedDomain {
            ...WrappedDomainDetails
          }
        }
      }
    }
    ${fragments_1.domainDetailsWithoutParentFragment}
    ${fragments_1.registrationDetailsFragment}
    ${fragments_1.wrappedDomainDetailsFragment}
  `;
    const queryVars = {
        id: (0, normalise_1.namehash)(name),
        orderBy,
        orderDirection,
        first: pageSize,
        whereFilter,
    };
    const result = await subgraphClient.request(query, queryVars);
    if (!result.domain)
        return [];
    const names = result.domain.subdomains.map((domain) => (0, utils_1.makeNameObject)({ ...domain, parent: { name } }));
    return names;
};
exports.default = getSubnames;
//# sourceMappingURL=getSubnames.js.map