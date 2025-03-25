export { createSubgraphClient } from './functions/subgraph/client';
export type { AbiChanged, AddrChanged, AuthorisationChanged, BaseDomainEvent, BaseRegistrationEvent, BaseResolverEvent, ContenthashChanged, DomainEvent, DomainEventKey, ExpiryExtended, FusesSet, InterfaceChanged, MulticoinAddrChanged, NameChanged, NameRegistered, NameRenewed, NameTransferred, NameUnwrapped, NameWrapped, NewOwner, NewResolver, NewTtl, PubkeyChanged, RegistrationEvent, RegistrationEventKey, ResolverEvent, ResolverEventKey, TextChanged, Transfer, VersionChanged, WrappedTransfer, } from './functions/subgraph/events';
export { default as getDecodedName, type GetDecodedNameParameters, type GetDecodedNameReturnType, } from './functions/subgraph/getDecodedName';
export { default as getNameHistory, type GetNameHistoryParameters, type GetNameHistoryReturnType, } from './functions/subgraph/getNameHistory';
export { default as getNamesForAddress, type GetNamesForAddressParameters, type GetNamesForAddressReturnType, type NameWithRelation, } from './functions/subgraph/getNamesForAddress';
export { default as getSubgraphRecords, type GetSubgraphRecordsParameters, type GetSubgraphRecordsReturnType, } from './functions/subgraph/getSubgraphRecords';
export { default as getSubgraphRegistrant, type GetSubgraphRegistrantParameters, type GetSubgraphRegistrantReturnType, } from './functions/subgraph/getSubgraphRegistrant';
export { default as getSubnames, type GetSubnamesParameters, type GetSubnamesReturnType, } from './functions/subgraph/getSubnames';
export { getChecksumAddressOrNull, makeNameObject, type Name, } from './functions/subgraph/utils';
//# sourceMappingURL=subgraph.d.ts.map