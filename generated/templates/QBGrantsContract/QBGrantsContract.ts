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

export class DisburseRewardFailed extends ethereum.Event {
  get params(): DisburseRewardFailed__Params {
    return new DisburseRewardFailed__Params(this);
  }
}

export class DisburseRewardFailed__Params {
  _event: DisburseRewardFailed;

  constructor(event: DisburseRewardFailed) {
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

  get time(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class FundsDepositFailed extends ethereum.Event {
  get params(): FundsDepositFailed__Params {
    return new FundsDepositFailed__Params(this);
  }
}

export class FundsDepositFailed__Params {
  _event: FundsDepositFailed;

  constructor(event: FundsDepositFailed) {
    this._event = event;
  }

  get asset(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get time(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class FundsWithdrawn extends ethereum.Event {
  get params(): FundsWithdrawn__Params {
    return new FundsWithdrawn__Params(this);
  }
}

export class FundsWithdrawn__Params {
  _event: FundsWithdrawn;

  constructor(event: FundsWithdrawn) {
    this._event = event;
  }

  get asset(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get recipient(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get time(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class GrantUpdated extends ethereum.Event {
  get params(): GrantUpdated__Params {
    return new GrantUpdated__Params(this);
  }
}

export class GrantUpdated__Params {
  _event: GrantUpdated;

  constructor(event: GrantUpdated) {
    this._event = event;
  }

  get workspaceId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get metadataHash(): string {
    return this._event.parameters[1].value.toString();
  }

  get active(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }

  get time(): BigInt {
    return this._event.parameters[3].value.toBigInt();
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

export class TransactionRecord extends ethereum.Event {
  get params(): TransactionRecord__Params {
    return new TransactionRecord__Params(this);
  }
}

export class TransactionRecord__Params {
  _event: TransactionRecord;

  constructor(event: TransactionRecord) {
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

  get transactionHash(): Bytes {
    return this._event.parameters[4].value.toBytes();
  }

  get amount(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get time(): BigInt {
    return this._event.parameters[6].value.toBigInt();
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

export class QBGrantsContract extends ethereum.SmartContract {
  static bind(address: Address): QBGrantsContract {
    return new QBGrantsContract("QBGrantsContract", address);
  }

  active(): boolean {
    let result = super.call("active", "active():(bool)", []);

    return result[0].toBoolean();
  }

  try_active(): ethereum.CallResult<boolean> {
    let result = super.tryCall("active", "active():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
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

  grantFactory(): Address {
    let result = super.call("grantFactory", "grantFactory():(address)", []);

    return result[0].toAddress();
  }

  try_grantFactory(): ethereum.CallResult<Address> {
    let result = super.tryCall("grantFactory", "grantFactory():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  metadataHash(): string {
    let result = super.call("metadataHash", "metadataHash():(string)", []);

    return result[0].toString();
  }

  try_metadataHash(): ethereum.CallResult<string> {
    let result = super.tryCall("metadataHash", "metadataHash():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  numApplicants(): BigInt {
    let result = super.call("numApplicants", "numApplicants():(uint96)", []);

    return result[0].toBigInt();
  }

  try_numApplicants(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("numApplicants", "numApplicants():(uint96)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
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

  workspaceId(): BigInt {
    let result = super.call("workspaceId", "workspaceId():(uint96)", []);

    return result[0].toBigInt();
  }

  try_workspaceId(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("workspaceId", "workspaceId():(uint96)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  workspaceReg(): Address {
    let result = super.call("workspaceReg", "workspaceReg():(address)", []);

    return result[0].toAddress();
  }

  try_workspaceReg(): ethereum.CallResult<Address> {
    let result = super.tryCall("workspaceReg", "workspaceReg():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class DisburseRewardCall extends ethereum.Call {
  get inputs(): DisburseRewardCall__Inputs {
    return new DisburseRewardCall__Inputs(this);
  }

  get outputs(): DisburseRewardCall__Outputs {
    return new DisburseRewardCall__Outputs(this);
  }
}

export class DisburseRewardCall__Inputs {
  _call: DisburseRewardCall;

  constructor(call: DisburseRewardCall) {
    this._call = call;
  }

  get _applicationId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _milestoneId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _erc20Interface(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class DisburseRewardCall__Outputs {
  _call: DisburseRewardCall;

  constructor(call: DisburseRewardCall) {
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
}

export class DisburseRewardP2PCall__Outputs {
  _call: DisburseRewardP2PCall;

  constructor(call: DisburseRewardP2PCall) {
    this._call = call;
  }
}

export class IncrementApplicantCall extends ethereum.Call {
  get inputs(): IncrementApplicantCall__Inputs {
    return new IncrementApplicantCall__Inputs(this);
  }

  get outputs(): IncrementApplicantCall__Outputs {
    return new IncrementApplicantCall__Outputs(this);
  }
}

export class IncrementApplicantCall__Inputs {
  _call: IncrementApplicantCall;

  constructor(call: IncrementApplicantCall) {
    this._call = call;
  }
}

export class IncrementApplicantCall__Outputs {
  _call: IncrementApplicantCall;

  constructor(call: IncrementApplicantCall) {
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

  get _workspaceId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _metadataHash(): string {
    return this._call.inputValues[1].value.toString();
  }

  get _workspaceReg(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _applicationReg(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get _grantFactory(): Address {
    return this._call.inputValues[4].value.toAddress();
  }

  get _grantFactoryOwner(): Address {
    return this._call.inputValues[5].value.toAddress();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class RecordTransactionCall extends ethereum.Call {
  get inputs(): RecordTransactionCall__Inputs {
    return new RecordTransactionCall__Inputs(this);
  }

  get outputs(): RecordTransactionCall__Outputs {
    return new RecordTransactionCall__Outputs(this);
  }
}

export class RecordTransactionCall__Inputs {
  _call: RecordTransactionCall;

  constructor(call: RecordTransactionCall) {
    this._call = call;
  }

  get _applicationId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _milestoneId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _asset(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _transactionHash(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }

  get _amount(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }
}

export class RecordTransactionCall__Outputs {
  _call: RecordTransactionCall;

  constructor(call: RecordTransactionCall) {
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

export class UpdateGrantCall extends ethereum.Call {
  get inputs(): UpdateGrantCall__Inputs {
    return new UpdateGrantCall__Inputs(this);
  }

  get outputs(): UpdateGrantCall__Outputs {
    return new UpdateGrantCall__Outputs(this);
  }
}

export class UpdateGrantCall__Inputs {
  _call: UpdateGrantCall;

  constructor(call: UpdateGrantCall) {
    this._call = call;
  }

  get _metadataHash(): string {
    return this._call.inputValues[0].value.toString();
  }
}

export class UpdateGrantCall__Outputs {
  _call: UpdateGrantCall;

  constructor(call: UpdateGrantCall) {
    this._call = call;
  }
}

export class UpdateGrantAccessibilityCall extends ethereum.Call {
  get inputs(): UpdateGrantAccessibilityCall__Inputs {
    return new UpdateGrantAccessibilityCall__Inputs(this);
  }

  get outputs(): UpdateGrantAccessibilityCall__Outputs {
    return new UpdateGrantAccessibilityCall__Outputs(this);
  }
}

export class UpdateGrantAccessibilityCall__Inputs {
  _call: UpdateGrantAccessibilityCall;

  constructor(call: UpdateGrantAccessibilityCall) {
    this._call = call;
  }

  get _canAcceptApplication(): boolean {
    return this._call.inputValues[0].value.toBoolean();
  }
}

export class UpdateGrantAccessibilityCall__Outputs {
  _call: UpdateGrantAccessibilityCall;

  constructor(call: UpdateGrantAccessibilityCall) {
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

export class WithdrawFundsCall extends ethereum.Call {
  get inputs(): WithdrawFundsCall__Inputs {
    return new WithdrawFundsCall__Inputs(this);
  }

  get outputs(): WithdrawFundsCall__Outputs {
    return new WithdrawFundsCall__Outputs(this);
  }
}

export class WithdrawFundsCall__Inputs {
  _call: WithdrawFundsCall;

  constructor(call: WithdrawFundsCall) {
    this._call = call;
  }

  get _erc20Interface(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _recipient(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class WithdrawFundsCall__Outputs {
  _call: WithdrawFundsCall;

  constructor(call: WithdrawFundsCall) {
    this._call = call;
  }
}
