// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class AdminChanged extends ethereum.Event {
  get params(): AdminChanged__Params {
    return new AdminChanged__Params(this);
  }
}

export class AdminChanged__Params {
  _event: AdminChanged;

  constructor(event: AdminChanged) {
    this._event = event;
  }

  get previousAdmin(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newAdmin(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class BeaconUpgraded extends ethereum.Event {
  get params(): BeaconUpgraded__Params {
    return new BeaconUpgraded__Params(this);
  }
}

export class BeaconUpgraded__Params {
  _event: BeaconUpgraded;

  constructor(event: BeaconUpgraded) {
    this._event = event;
  }

  get beacon(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class DisburseReward extends ethereum.Event {
  get params(): DisburseReward__Params {
    return new DisburseReward__Params(this);
  }
}

export class DisburseReward__Params {
  _event: DisburseReward;

  constructor(event: DisburseReward) {
    this._event = event;
  }

  get applicationId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get milestoneId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get asset(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get sender(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get isP2P(): boolean {
    return this._event.parameters[5].value.toBoolean();
  }

  get time(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }
}

export class DisburseRewardFromSafe extends ethereum.Event {
  get params(): DisburseRewardFromSafe__Params {
    return new DisburseRewardFromSafe__Params(this);
  }
}

export class DisburseRewardFromSafe__Params {
  _event: DisburseRewardFromSafe;

  constructor(event: DisburseRewardFromSafe) {
    this._event = event;
  }

  get applicationIds(): Array<BigInt> {
    return this._event.parameters[0].value.toBigIntArray();
  }

  get milestoneIds(): Array<BigInt> {
    return this._event.parameters[1].value.toBigIntArray();
  }

  get asset(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get nonEvmAssetAddress(): string {
    return this._event.parameters[3].value.toString();
  }

  get transactionHash(): string {
    return this._event.parameters[4].value.toString();
  }

  get sender(): Address {
    return this._event.parameters[5].value.toAddress();
  }

  get amounts(): Array<BigInt> {
    return this._event.parameters[6].value.toBigIntArray();
  }

  get isP2P(): boolean {
    return this._event.parameters[7].value.toBoolean();
  }

  get time(): BigInt {
    return this._event.parameters[8].value.toBigInt();
  }
}

export class FundsTransferStatusUpdated extends ethereum.Event {
  get params(): FundsTransferStatusUpdated__Params {
    return new FundsTransferStatusUpdated__Params(this);
  }
}

export class FundsTransferStatusUpdated__Params {
  _event: FundsTransferStatusUpdated;

  constructor(event: FundsTransferStatusUpdated) {
    this._event = event;
  }

  get transactionHash(): string {
    return this._event.parameters[0].value.toString();
  }

  get status(): string {
    return this._event.parameters[1].value.toString();
  }

  get tokenName(): string {
    return this._event.parameters[2].value.toString();
  }

  get tokenUSDValue(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get executionTimestamp(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class Initialized extends ethereum.Event {
  get params(): Initialized__Params {
    return new Initialized__Params(this);
  }
}

export class Initialized__Params {
  _event: Initialized;

  constructor(event: Initialized) {
    this._event = event;
  }

  get version(): i32 {
    return this._event.parameters[0].value.toI32();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Paused extends ethereum.Event {
  get params(): Paused__Params {
    return new Paused__Params(this);
  }
}

export class Paused__Params {
  _event: Paused;

  constructor(event: Paused) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class QBAdminsUpdated extends ethereum.Event {
  get params(): QBAdminsUpdated__Params {
    return new QBAdminsUpdated__Params(this);
  }
}

export class QBAdminsUpdated__Params {
  _event: QBAdminsUpdated;

  constructor(event: QBAdminsUpdated) {
    this._event = event;
  }

  get walletAddresses(): Array<Address> {
    return this._event.parameters[0].value.toAddressArray();
  }

  get isAdded(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }

  get time(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Unpaused extends ethereum.Event {
  get params(): Unpaused__Params {
    return new Unpaused__Params(this);
  }
}

export class Unpaused__Params {
  _event: Unpaused;

  constructor(event: Unpaused) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class Upgraded extends ethereum.Event {
  get params(): Upgraded__Params {
    return new Upgraded__Params(this);
  }
}

export class Upgraded__Params {
  _event: Upgraded;

  constructor(event: Upgraded) {
    this._event = event;
  }

  get implementation(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class WorkspaceCreated extends ethereum.Event {
  get params(): WorkspaceCreated__Params {
    return new WorkspaceCreated__Params(this);
  }
}

export class WorkspaceCreated__Params {
  _event: WorkspaceCreated;

  constructor(event: WorkspaceCreated) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get owner(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get metadataHash(): string {
    return this._event.parameters[2].value.toString();
  }

  get time(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class WorkspaceMemberMigrate extends ethereum.Event {
  get params(): WorkspaceMemberMigrate__Params {
    return new WorkspaceMemberMigrate__Params(this);
  }
}

export class WorkspaceMemberMigrate__Params {
  _event: WorkspaceMemberMigrate;

  constructor(event: WorkspaceMemberMigrate) {
    this._event = event;
  }

  get workspaceId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get time(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class WorkspaceMemberUpdated extends ethereum.Event {
  get params(): WorkspaceMemberUpdated__Params {
    return new WorkspaceMemberUpdated__Params(this);
  }
}

export class WorkspaceMemberUpdated__Params {
  _event: WorkspaceMemberUpdated;

  constructor(event: WorkspaceMemberUpdated) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get member(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get role(): i32 {
    return this._event.parameters[2].value.toI32();
  }

  get enabled(): boolean {
    return this._event.parameters[3].value.toBoolean();
  }

  get metadataHash(): string {
    return this._event.parameters[4].value.toString();
  }

  get time(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class WorkspaceMembersUpdated extends ethereum.Event {
  get params(): WorkspaceMembersUpdated__Params {
    return new WorkspaceMembersUpdated__Params(this);
  }
}

export class WorkspaceMembersUpdated__Params {
  _event: WorkspaceMembersUpdated;

  constructor(event: WorkspaceMembersUpdated) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get members(): Array<Address> {
    return this._event.parameters[1].value.toAddressArray();
  }

  get roles(): Array<i32> {
    return this._event.parameters[2].value.toI32Array();
  }

  get enabled(): Array<boolean> {
    return this._event.parameters[3].value.toBooleanArray();
  }

  get emails(): Array<string> {
    return this._event.parameters[4].value.toStringArray();
  }

  get time(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class WorkspaceSafeUpdated extends ethereum.Event {
  get params(): WorkspaceSafeUpdated__Params {
    return new WorkspaceSafeUpdated__Params(this);
  }
}

export class WorkspaceSafeUpdated__Params {
  _event: WorkspaceSafeUpdated;

  constructor(event: WorkspaceSafeUpdated) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get safeAddress(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get longSafeAddress(): string {
    return this._event.parameters[2].value.toString();
  }

  get safeChainId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get time(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class WorkspaceUpdated extends ethereum.Event {
  get params(): WorkspaceUpdated__Params {
    return new WorkspaceUpdated__Params(this);
  }
}

export class WorkspaceUpdated__Params {
  _event: WorkspaceUpdated;

  constructor(event: WorkspaceUpdated) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get owner(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get metadataHash(): string {
    return this._event.parameters[2].value.toString();
  }

  get time(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class WorkspacesVisibleUpdated extends ethereum.Event {
  get params(): WorkspacesVisibleUpdated__Params {
    return new WorkspacesVisibleUpdated__Params(this);
  }
}

export class WorkspacesVisibleUpdated__Params {
  _event: WorkspacesVisibleUpdated;

  constructor(event: WorkspacesVisibleUpdated) {
    this._event = event;
  }

  get workspaceId(): Array<BigInt> {
    return this._event.parameters[0].value.toBigIntArray();
  }

  get isVisible(): Array<boolean> {
    return this._event.parameters[1].value.toBooleanArray();
  }
}

export class QBWorkspaceRegistryContract__workspacesResultSafeStruct extends ethereum.Tuple {
  get _address(): Bytes {
    return this[0].toBytes();
  }

  get chainId(): BigInt {
    return this[1].toBigInt();
  }
}

export class QBWorkspaceRegistryContract__workspacesResult {
  value0: BigInt;
  value1: Address;
  value2: string;
  value3: QBWorkspaceRegistryContract__workspacesResultSafeStruct;

  constructor(
    value0: BigInt,
    value1: Address,
    value2: string,
    value3: QBWorkspaceRegistryContract__workspacesResultSafeStruct
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromAddress(this.value1));
    map.set("value2", ethereum.Value.fromString(this.value2));
    map.set("value3", ethereum.Value.fromTuple(this.value3));
    return map;
  }
}

export class QBWorkspaceRegistryContract extends ethereum.SmartContract {
  static bind(address: Address): QBWorkspaceRegistryContract {
    return new QBWorkspaceRegistryContract(
      "QBWorkspaceRegistryContract",
      address
    );
  }

  anonAuthoriserAddress(): Address {
    let result = super.call(
      "anonAuthoriserAddress",
      "anonAuthoriserAddress():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_anonAuthoriserAddress(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "anonAuthoriserAddress",
      "anonAuthoriserAddress():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  apiFlagForWorkspaceId(workspaceId: BigInt, role: i32): Bytes {
    let result = super.call(
      "apiFlagForWorkspaceId",
      "apiFlagForWorkspaceId(uint96,uint8):(bytes32)",
      [
        ethereum.Value.fromUnsignedBigInt(workspaceId),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(role))
      ]
    );

    return result[0].toBytes();
  }

  try_apiFlagForWorkspaceId(
    workspaceId: BigInt,
    role: i32
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "apiFlagForWorkspaceId",
      "apiFlagForWorkspaceId(uint96,uint8):(bytes32)",
      [
        ethereum.Value.fromUnsignedBigInt(workspaceId),
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(role))
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  applicationReg(): Address {
    let result = super.call("applicationReg", "applicationReg():(address)", []);

    return result[0].toAddress();
  }

  try_applicationReg(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "applicationReg",
      "applicationReg():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getQBAdmins(): Array<Address> {
    let result = super.call("getQBAdmins", "getQBAdmins():(address[])", []);

    return result[0].toAddressArray();
  }

  try_getQBAdmins(): ethereum.CallResult<Array<Address>> {
    let result = super.tryCall("getQBAdmins", "getQBAdmins():(address[])", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddressArray());
  }

  isWorkspaceAdmin(_id: BigInt, _address: Address): boolean {
    let result = super.call(
      "isWorkspaceAdmin",
      "isWorkspaceAdmin(uint96,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(_id),
        ethereum.Value.fromAddress(_address)
      ]
    );

    return result[0].toBoolean();
  }

  try_isWorkspaceAdmin(
    _id: BigInt,
    _address: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isWorkspaceAdmin",
      "isWorkspaceAdmin(uint96,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(_id),
        ethereum.Value.fromAddress(_address)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isWorkspaceAdminOrReviewer(_id: BigInt, _address: Address): boolean {
    let result = super.call(
      "isWorkspaceAdminOrReviewer",
      "isWorkspaceAdminOrReviewer(uint96,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(_id),
        ethereum.Value.fromAddress(_address)
      ]
    );

    return result[0].toBoolean();
  }

  try_isWorkspaceAdminOrReviewer(
    _id: BigInt,
    _address: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isWorkspaceAdminOrReviewer",
      "isWorkspaceAdminOrReviewer(uint96,address):(bool)",
      [
        ethereum.Value.fromUnsignedBigInt(_id),
        ethereum.Value.fromAddress(_address)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  memberRoles(param0: BigInt, param1: Address): Bytes {
    let result = super.call(
      "memberRoles",
      "memberRoles(uint96,address):(bytes32)",
      [
        ethereum.Value.fromUnsignedBigInt(param0),
        ethereum.Value.fromAddress(param1)
      ]
    );

    return result[0].toBytes();
  }

  try_memberRoles(param0: BigInt, param1: Address): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "memberRoles",
      "memberRoles(uint96,address):(bytes32)",
      [
        ethereum.Value.fromUnsignedBigInt(param0),
        ethereum.Value.fromAddress(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  paused(): boolean {
    let result = super.call("paused", "paused():(bool)", []);

    return result[0].toBoolean();
  }

  try_paused(): ethereum.CallResult<boolean> {
    let result = super.tryCall("paused", "paused():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  proxiableUUID(): Bytes {
    let result = super.call("proxiableUUID", "proxiableUUID():(bytes32)", []);

    return result[0].toBytes();
  }

  try_proxiableUUID(): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "proxiableUUID",
      "proxiableUUID():(bytes32)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  qbAdmins(param0: BigInt): Address {
    let result = super.call("qbAdmins", "qbAdmins(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);

    return result[0].toAddress();
  }

  try_qbAdmins(param0: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall("qbAdmins", "qbAdmins(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  workspaceCount(): BigInt {
    let result = super.call("workspaceCount", "workspaceCount():(uint96)", []);

    return result[0].toBigInt();
  }

  try_workspaceCount(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "workspaceCount",
      "workspaceCount():(uint96)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  workspaces(param0: BigInt): QBWorkspaceRegistryContract__workspacesResult {
    let result = super.call(
      "workspaces",
      "workspaces(uint96):(uint96,address,string,(bytes32,uint256))",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new QBWorkspaceRegistryContract__workspacesResult(
      result[0].toBigInt(),
      result[1].toAddress(),
      result[2].toString(),
      changetype<QBWorkspaceRegistryContract__workspacesResultSafeStruct>(
        result[3].toTuple()
      )
    );
  }

  try_workspaces(
    param0: BigInt
  ): ethereum.CallResult<QBWorkspaceRegistryContract__workspacesResult> {
    let result = super.tryCall(
      "workspaces",
      "workspaces(uint96):(uint96,address,string,(bytes32,uint256))",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new QBWorkspaceRegistryContract__workspacesResult(
        value[0].toBigInt(),
        value[1].toAddress(),
        value[2].toString(),
        changetype<QBWorkspaceRegistryContract__workspacesResultSafeStruct>(
          value[3].toTuple()
        )
      )
    );
  }
}

export class AddQBAdminsCall extends ethereum.Call {
  get inputs(): AddQBAdminsCall__Inputs {
    return new AddQBAdminsCall__Inputs(this);
  }

  get outputs(): AddQBAdminsCall__Outputs {
    return new AddQBAdminsCall__Outputs(this);
  }
}

export class AddQBAdminsCall__Inputs {
  _call: AddQBAdminsCall;

  constructor(call: AddQBAdminsCall) {
    this._call = call;
  }

  get _addresses(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }
}

export class AddQBAdminsCall__Outputs {
  _call: AddQBAdminsCall;

  constructor(call: AddQBAdminsCall) {
    this._call = call;
  }
}

export class CreateInviteLinkCall extends ethereum.Call {
  get inputs(): CreateInviteLinkCall__Inputs {
    return new CreateInviteLinkCall__Inputs(this);
  }

  get outputs(): CreateInviteLinkCall__Outputs {
    return new CreateInviteLinkCall__Outputs(this);
  }
}

export class CreateInviteLinkCall__Inputs {
  _call: CreateInviteLinkCall;

  constructor(call: CreateInviteLinkCall) {
    this._call = call;
  }

  get _id(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _role(): i32 {
    return this._call.inputValues[1].value.toI32();
  }

  get publicKeyAddress(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class CreateInviteLinkCall__Outputs {
  _call: CreateInviteLinkCall;

  constructor(call: CreateInviteLinkCall) {
    this._call = call;
  }
}

export class CreateWorkspaceCall extends ethereum.Call {
  get inputs(): CreateWorkspaceCall__Inputs {
    return new CreateWorkspaceCall__Inputs(this);
  }

  get outputs(): CreateWorkspaceCall__Outputs {
    return new CreateWorkspaceCall__Outputs(this);
  }
}

export class CreateWorkspaceCall__Inputs {
  _call: CreateWorkspaceCall;

  constructor(call: CreateWorkspaceCall) {
    this._call = call;
  }

  get _metadataHash(): string {
    return this._call.inputValues[0].value.toString();
  }

  get _safeAddress(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get _longSafeAddress(): string {
    return this._call.inputValues[2].value.toString();
  }

  get _safeChainId(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class CreateWorkspaceCall__Outputs {
  _call: CreateWorkspaceCall;

  constructor(call: CreateWorkspaceCall) {
    this._call = call;
  }
}

export class DisburseRewardFromSafeCall extends ethereum.Call {
  get inputs(): DisburseRewardFromSafeCall__Inputs {
    return new DisburseRewardFromSafeCall__Inputs(this);
  }

  get outputs(): DisburseRewardFromSafeCall__Outputs {
    return new DisburseRewardFromSafeCall__Outputs(this);
  }
}

export class DisburseRewardFromSafeCall__Inputs {
  _call: DisburseRewardFromSafeCall;

  constructor(call: DisburseRewardFromSafeCall) {
    this._call = call;
  }

  get _applicationIds(): Array<BigInt> {
    return this._call.inputValues[0].value.toBigIntArray();
  }

  get _milestoneIds(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }

  get _erc20Interface(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get nonEvmAssetAddress(): string {
    return this._call.inputValues[3].value.toString();
  }

  get _amounts(): Array<BigInt> {
    return this._call.inputValues[4].value.toBigIntArray();
  }

  get _workspaceId(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get transactionHash(): string {
    return this._call.inputValues[6].value.toString();
  }
}

export class DisburseRewardFromSafeCall__Outputs {
  _call: DisburseRewardFromSafeCall;

  constructor(call: DisburseRewardFromSafeCall) {
    this._call = call;
  }
}

export class DisburseRewardP2PCall extends ethereum.Call {
  get inputs(): DisburseRewardP2PCall__Inputs {
    return new DisburseRewardP2PCall__Inputs(this);
  }

  get outputs(): DisburseRewardP2PCall__Outputs {
    return new DisburseRewardP2PCall__Outputs(this);
  }
}

export class DisburseRewardP2PCall__Inputs {
  _call: DisburseRewardP2PCall;

  constructor(call: DisburseRewardP2PCall) {
    this._call = call;
  }

  get _applicationId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _applicantWalletAddress(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _milestoneId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _erc20Interface(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get _workspaceId(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }
}

export class DisburseRewardP2PCall__Outputs {
  _call: DisburseRewardP2PCall;

  constructor(call: DisburseRewardP2PCall) {
    this._call = call;
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class JoinViaInviteLinkCall extends ethereum.Call {
  get inputs(): JoinViaInviteLinkCall__Inputs {
    return new JoinViaInviteLinkCall__Inputs(this);
  }

  get outputs(): JoinViaInviteLinkCall__Outputs {
    return new JoinViaInviteLinkCall__Outputs(this);
  }
}

export class JoinViaInviteLinkCall__Inputs {
  _call: JoinViaInviteLinkCall;

  constructor(call: JoinViaInviteLinkCall) {
    this._call = call;
  }

  get _id(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _metadataHash(): string {
    return this._call.inputValues[1].value.toString();
  }

  get _role(): i32 {
    return this._call.inputValues[2].value.toI32();
  }

  get signatureV(): i32 {
    return this._call.inputValues[3].value.toI32();
  }

  get signatureR(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }

  get signatureS(): Bytes {
    return this._call.inputValues[5].value.toBytes();
  }
}

export class JoinViaInviteLinkCall__Outputs {
  _call: JoinViaInviteLinkCall;

  constructor(call: JoinViaInviteLinkCall) {
    this._call = call;
  }
}

export class MigrateWalletCall extends ethereum.Call {
  get inputs(): MigrateWalletCall__Inputs {
    return new MigrateWalletCall__Inputs(this);
  }

  get outputs(): MigrateWalletCall__Outputs {
    return new MigrateWalletCall__Outputs(this);
  }
}

export class MigrateWalletCall__Inputs {
  _call: MigrateWalletCall;

  constructor(call: MigrateWalletCall) {
    this._call = call;
  }

  get fromWallet(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get toWallet(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class MigrateWalletCall__Outputs {
  _call: MigrateWalletCall;

  constructor(call: MigrateWalletCall) {
    this._call = call;
  }
}

export class PauseCall extends ethereum.Call {
  get inputs(): PauseCall__Inputs {
    return new PauseCall__Inputs(this);
  }

  get outputs(): PauseCall__Outputs {
    return new PauseCall__Outputs(this);
  }
}

export class PauseCall__Inputs {
  _call: PauseCall;

  constructor(call: PauseCall) {
    this._call = call;
  }
}

export class PauseCall__Outputs {
  _call: PauseCall;

  constructor(call: PauseCall) {
    this._call = call;
  }
}

export class RemoveQBAdminsCall extends ethereum.Call {
  get inputs(): RemoveQBAdminsCall__Inputs {
    return new RemoveQBAdminsCall__Inputs(this);
  }

  get outputs(): RemoveQBAdminsCall__Outputs {
    return new RemoveQBAdminsCall__Outputs(this);
  }
}

export class RemoveQBAdminsCall__Inputs {
  _call: RemoveQBAdminsCall;

  constructor(call: RemoveQBAdminsCall) {
    this._call = call;
  }

  get _addresses(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }
}

export class RemoveQBAdminsCall__Outputs {
  _call: RemoveQBAdminsCall;

  constructor(call: RemoveQBAdminsCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SetApplicationRegCall extends ethereum.Call {
  get inputs(): SetApplicationRegCall__Inputs {
    return new SetApplicationRegCall__Inputs(this);
  }

  get outputs(): SetApplicationRegCall__Outputs {
    return new SetApplicationRegCall__Outputs(this);
  }
}

export class SetApplicationRegCall__Inputs {
  _call: SetApplicationRegCall;

  constructor(call: SetApplicationRegCall) {
    this._call = call;
  }

  get _applicationReg(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetApplicationRegCall__Outputs {
  _call: SetApplicationRegCall;

  constructor(call: SetApplicationRegCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class UnpauseCall extends ethereum.Call {
  get inputs(): UnpauseCall__Inputs {
    return new UnpauseCall__Inputs(this);
  }

  get outputs(): UnpauseCall__Outputs {
    return new UnpauseCall__Outputs(this);
  }
}

export class UnpauseCall__Inputs {
  _call: UnpauseCall;

  constructor(call: UnpauseCall) {
    this._call = call;
  }
}

export class UnpauseCall__Outputs {
  _call: UnpauseCall;

  constructor(call: UnpauseCall) {
    this._call = call;
  }
}

export class UpdateAnonAuthoriserAddressCall extends ethereum.Call {
  get inputs(): UpdateAnonAuthoriserAddressCall__Inputs {
    return new UpdateAnonAuthoriserAddressCall__Inputs(this);
  }

  get outputs(): UpdateAnonAuthoriserAddressCall__Outputs {
    return new UpdateAnonAuthoriserAddressCall__Outputs(this);
  }
}

export class UpdateAnonAuthoriserAddressCall__Inputs {
  _call: UpdateAnonAuthoriserAddressCall;

  constructor(call: UpdateAnonAuthoriserAddressCall) {
    this._call = call;
  }

  get addr(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class UpdateAnonAuthoriserAddressCall__Outputs {
  _call: UpdateAnonAuthoriserAddressCall;

  constructor(call: UpdateAnonAuthoriserAddressCall) {
    this._call = call;
  }
}

export class UpdateFundsTransferTransactionStatusCall extends ethereum.Call {
  get inputs(): UpdateFundsTransferTransactionStatusCall__Inputs {
    return new UpdateFundsTransferTransactionStatusCall__Inputs(this);
  }

  get outputs(): UpdateFundsTransferTransactionStatusCall__Outputs {
    return new UpdateFundsTransferTransactionStatusCall__Outputs(this);
  }
}

export class UpdateFundsTransferTransactionStatusCall__Inputs {
  _call: UpdateFundsTransferTransactionStatusCall;

  constructor(call: UpdateFundsTransferTransactionStatusCall) {
    this._call = call;
  }

  get _transactionHash(): string {
    return this._call.inputValues[0].value.toString();
  }

  get _status(): string {
    return this._call.inputValues[1].value.toString();
  }

  get _tokenName(): string {
    return this._call.inputValues[2].value.toString();
  }

  get _tokenUSDValue(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get _executionTimestamp(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }
}

export class UpdateFundsTransferTransactionStatusCall__Outputs {
  _call: UpdateFundsTransferTransactionStatusCall;

  constructor(call: UpdateFundsTransferTransactionStatusCall) {
    this._call = call;
  }
}

export class UpdateWorkspaceMembersCall extends ethereum.Call {
  get inputs(): UpdateWorkspaceMembersCall__Inputs {
    return new UpdateWorkspaceMembersCall__Inputs(this);
  }

  get outputs(): UpdateWorkspaceMembersCall__Outputs {
    return new UpdateWorkspaceMembersCall__Outputs(this);
  }
}

export class UpdateWorkspaceMembersCall__Inputs {
  _call: UpdateWorkspaceMembersCall;

  constructor(call: UpdateWorkspaceMembersCall) {
    this._call = call;
  }

  get _id(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _members(): Array<Address> {
    return this._call.inputValues[1].value.toAddressArray();
  }

  get _roles(): Array<i32> {
    return this._call.inputValues[2].value.toI32Array();
  }

  get _enabled(): Array<boolean> {
    return this._call.inputValues[3].value.toBooleanArray();
  }

  get _metadataHashes(): Array<string> {
    return this._call.inputValues[4].value.toStringArray();
  }
}

export class UpdateWorkspaceMembersCall__Outputs {
  _call: UpdateWorkspaceMembersCall;

  constructor(call: UpdateWorkspaceMembersCall) {
    this._call = call;
  }
}

export class UpdateWorkspaceMetadataCall extends ethereum.Call {
  get inputs(): UpdateWorkspaceMetadataCall__Inputs {
    return new UpdateWorkspaceMetadataCall__Inputs(this);
  }

  get outputs(): UpdateWorkspaceMetadataCall__Outputs {
    return new UpdateWorkspaceMetadataCall__Outputs(this);
  }
}

export class UpdateWorkspaceMetadataCall__Inputs {
  _call: UpdateWorkspaceMetadataCall;

  constructor(call: UpdateWorkspaceMetadataCall) {
    this._call = call;
  }

  get _id(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _metadataHash(): string {
    return this._call.inputValues[1].value.toString();
  }
}

export class UpdateWorkspaceMetadataCall__Outputs {
  _call: UpdateWorkspaceMetadataCall;

  constructor(call: UpdateWorkspaceMetadataCall) {
    this._call = call;
  }
}

export class UpdateWorkspaceSafeCall extends ethereum.Call {
  get inputs(): UpdateWorkspaceSafeCall__Inputs {
    return new UpdateWorkspaceSafeCall__Inputs(this);
  }

  get outputs(): UpdateWorkspaceSafeCall__Outputs {
    return new UpdateWorkspaceSafeCall__Outputs(this);
  }
}

export class UpdateWorkspaceSafeCall__Inputs {
  _call: UpdateWorkspaceSafeCall;

  constructor(call: UpdateWorkspaceSafeCall) {
    this._call = call;
  }

  get _id(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _safeAddress(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }

  get _longSafeAddress(): string {
    return this._call.inputValues[2].value.toString();
  }

  get _safeChainId(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class UpdateWorkspaceSafeCall__Outputs {
  _call: UpdateWorkspaceSafeCall;

  constructor(call: UpdateWorkspaceSafeCall) {
    this._call = call;
  }
}

export class UpdateWorkspacesVisibleCall extends ethereum.Call {
  get inputs(): UpdateWorkspacesVisibleCall__Inputs {
    return new UpdateWorkspacesVisibleCall__Inputs(this);
  }

  get outputs(): UpdateWorkspacesVisibleCall__Outputs {
    return new UpdateWorkspacesVisibleCall__Outputs(this);
  }
}

export class UpdateWorkspacesVisibleCall__Inputs {
  _call: UpdateWorkspacesVisibleCall;

  constructor(call: UpdateWorkspacesVisibleCall) {
    this._call = call;
  }

  get _workspaceIds(): Array<BigInt> {
    return this._call.inputValues[0].value.toBigIntArray();
  }

  get _isVisible(): Array<boolean> {
    return this._call.inputValues[1].value.toBooleanArray();
  }
}

export class UpdateWorkspacesVisibleCall__Outputs {
  _call: UpdateWorkspacesVisibleCall;

  constructor(call: UpdateWorkspacesVisibleCall) {
    this._call = call;
  }
}

export class UpgradeToCall extends ethereum.Call {
  get inputs(): UpgradeToCall__Inputs {
    return new UpgradeToCall__Inputs(this);
  }

  get outputs(): UpgradeToCall__Outputs {
    return new UpgradeToCall__Outputs(this);
  }
}

export class UpgradeToCall__Inputs {
  _call: UpgradeToCall;

  constructor(call: UpgradeToCall) {
    this._call = call;
  }

  get newImplementation(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class UpgradeToCall__Outputs {
  _call: UpgradeToCall;

  constructor(call: UpgradeToCall) {
    this._call = call;
  }
}

export class UpgradeToAndCallCall extends ethereum.Call {
  get inputs(): UpgradeToAndCallCall__Inputs {
    return new UpgradeToAndCallCall__Inputs(this);
  }

  get outputs(): UpgradeToAndCallCall__Outputs {
    return new UpgradeToAndCallCall__Outputs(this);
  }
}

export class UpgradeToAndCallCall__Inputs {
  _call: UpgradeToAndCallCall;

  constructor(call: UpgradeToAndCallCall) {
    this._call = call;
  }

  get newImplementation(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get data(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }
}

export class UpgradeToAndCallCall__Outputs {
  _call: UpgradeToAndCallCall;

  constructor(call: UpgradeToAndCallCall) {
    this._call = call;
  }
}
