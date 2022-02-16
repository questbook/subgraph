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

export class ApplicationSubmitted extends ethereum.Event {
  get params(): ApplicationSubmitted__Params {
    return new ApplicationSubmitted__Params(this);
  }
}

export class ApplicationSubmitted__Params {
  _event: ApplicationSubmitted;

  constructor(event: ApplicationSubmitted) {
    this._event = event;
  }

  get applicationId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get grant(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get owner(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get metadataHash(): string {
    return this._event.parameters[3].value.toString();
  }

  get milestoneCount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get time(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class ApplicationUpdated extends ethereum.Event {
  get params(): ApplicationUpdated__Params {
    return new ApplicationUpdated__Params(this);
  }
}

export class ApplicationUpdated__Params {
  _event: ApplicationUpdated;

  constructor(event: ApplicationUpdated) {
    this._event = event;
  }

  get applicationId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get owner(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get metadataHash(): string {
    return this._event.parameters[2].value.toString();
  }

  get state(): i32 {
    return this._event.parameters[3].value.toI32();
  }

  get milestoneCount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get time(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class MilestoneUpdated extends ethereum.Event {
  get params(): MilestoneUpdated__Params {
    return new MilestoneUpdated__Params(this);
  }
}

export class MilestoneUpdated__Params {
  _event: MilestoneUpdated;

  constructor(event: MilestoneUpdated) {
    this._event = event;
  }

  get _id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get _milestoneId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get _state(): i32 {
    return this._event.parameters[2].value.toI32();
  }

  get _metadataHash(): string {
    return this._event.parameters[3].value.toString();
  }

  get time(): BigInt {
    return this._event.parameters[4].value.toBigInt();
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

export class QBApplicationsContract__applicationsResult {
  value0: BigInt;
  value1: BigInt;
  value2: Address;
  value3: Address;
  value4: BigInt;
  value5: string;
  value6: i32;
  value7: boolean;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: Address,
    value3: Address,
    value4: BigInt,
    value5: string,
    value6: i32,
    value7: boolean
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
    this.value6 = value6;
    this.value7 = value7;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromAddress(this.value2));
    map.set("value3", ethereum.Value.fromAddress(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    map.set("value5", ethereum.Value.fromString(this.value5));
    map.set(
      "value6",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value6))
    );
    map.set("value7", ethereum.Value.fromBoolean(this.value7));
    return map;
  }
}

export class QBApplicationsContract extends ethereum.SmartContract {
  static bind(address: Address): QBApplicationsContract {
    return new QBApplicationsContract("QBApplicationsContract", address);
  }

  applicationCount(): BigInt {
    let result = super.call(
      "applicationCount",
      "applicationCount():(uint96)",
      []
    );

    return result[0].toBigInt();
  }

  try_applicationCount(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "applicationCount",
      "applicationCount():(uint96)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  applicationMilestones(param0: BigInt, param1: BigInt): i32 {
    let result = super.call(
      "applicationMilestones",
      "applicationMilestones(uint96,uint48):(uint8)",
      [
        ethereum.Value.fromUnsignedBigInt(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return result[0].toI32();
  }

  try_applicationMilestones(
    param0: BigInt,
    param1: BigInt
  ): ethereum.CallResult<i32> {
    let result = super.tryCall(
      "applicationMilestones",
      "applicationMilestones(uint96,uint48):(uint8)",
      [
        ethereum.Value.fromUnsignedBigInt(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  applications(param0: BigInt): QBApplicationsContract__applicationsResult {
    let result = super.call(
      "applications",
      "applications(uint96):(uint96,uint96,address,address,uint48,string,uint8,bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new QBApplicationsContract__applicationsResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toAddress(),
      result[3].toAddress(),
      result[4].toBigInt(),
      result[5].toString(),
      result[6].toI32(),
      result[7].toBoolean()
    );
  }

  try_applications(
    param0: BigInt
  ): ethereum.CallResult<QBApplicationsContract__applicationsResult> {
    let result = super.tryCall(
      "applications",
      "applications(uint96):(uint96,uint96,address,address,uint48,string,uint8,bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new QBApplicationsContract__applicationsResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toAddress(),
        value[3].toAddress(),
        value[4].toBigInt(),
        value[5].toString(),
        value[6].toI32(),
        value[7].toBoolean()
      )
    );
  }

  getApplicationOwner(_applicationId: BigInt): Address {
    let result = super.call(
      "getApplicationOwner",
      "getApplicationOwner(uint96):(address)",
      [ethereum.Value.fromUnsignedBigInt(_applicationId)]
    );

    return result[0].toAddress();
  }

  try_getApplicationOwner(
    _applicationId: BigInt
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getApplicationOwner",
      "getApplicationOwner(uint96):(address)",
      [ethereum.Value.fromUnsignedBigInt(_applicationId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
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

export class ApproveMilestoneCall extends ethereum.Call {
  get inputs(): ApproveMilestoneCall__Inputs {
    return new ApproveMilestoneCall__Inputs(this);
  }

  get outputs(): ApproveMilestoneCall__Outputs {
    return new ApproveMilestoneCall__Outputs(this);
  }
}

export class ApproveMilestoneCall__Inputs {
  _call: ApproveMilestoneCall;

  constructor(call: ApproveMilestoneCall) {
    this._call = call;
  }

  get _applicationId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _milestoneId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _workspaceId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _reasonMetadataHash(): string {
    return this._call.inputValues[3].value.toString();
  }
}

export class ApproveMilestoneCall__Outputs {
  _call: ApproveMilestoneCall;

  constructor(call: ApproveMilestoneCall) {
    this._call = call;
  }
}

export class CompleteApplicationCall extends ethereum.Call {
  get inputs(): CompleteApplicationCall__Inputs {
    return new CompleteApplicationCall__Inputs(this);
  }

  get outputs(): CompleteApplicationCall__Outputs {
    return new CompleteApplicationCall__Outputs(this);
  }
}

export class CompleteApplicationCall__Inputs {
  _call: CompleteApplicationCall;

  constructor(call: CompleteApplicationCall) {
    this._call = call;
  }

  get _applicationId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _workspaceId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _reasonMetadataHash(): string {
    return this._call.inputValues[2].value.toString();
  }
}

export class CompleteApplicationCall__Outputs {
  _call: CompleteApplicationCall;

  constructor(call: CompleteApplicationCall) {
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

export class RequestMilestoneApprovalCall extends ethereum.Call {
  get inputs(): RequestMilestoneApprovalCall__Inputs {
    return new RequestMilestoneApprovalCall__Inputs(this);
  }

  get outputs(): RequestMilestoneApprovalCall__Outputs {
    return new RequestMilestoneApprovalCall__Outputs(this);
  }
}

export class RequestMilestoneApprovalCall__Inputs {
  _call: RequestMilestoneApprovalCall;

  constructor(call: RequestMilestoneApprovalCall) {
    this._call = call;
  }

  get _applicationId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _milestoneId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _reasonMetadataHash(): string {
    return this._call.inputValues[2].value.toString();
  }
}

export class RequestMilestoneApprovalCall__Outputs {
  _call: RequestMilestoneApprovalCall;

  constructor(call: RequestMilestoneApprovalCall) {
    this._call = call;
  }
}

export class SetWorkspaceRegCall extends ethereum.Call {
  get inputs(): SetWorkspaceRegCall__Inputs {
    return new SetWorkspaceRegCall__Inputs(this);
  }

  get outputs(): SetWorkspaceRegCall__Outputs {
    return new SetWorkspaceRegCall__Outputs(this);
  }
}

export class SetWorkspaceRegCall__Inputs {
  _call: SetWorkspaceRegCall;

  constructor(call: SetWorkspaceRegCall) {
    this._call = call;
  }

  get _workspaceReg(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetWorkspaceRegCall__Outputs {
  _call: SetWorkspaceRegCall;

  constructor(call: SetWorkspaceRegCall) {
    this._call = call;
  }
}

export class SubmitApplicationCall extends ethereum.Call {
  get inputs(): SubmitApplicationCall__Inputs {
    return new SubmitApplicationCall__Inputs(this);
  }

  get outputs(): SubmitApplicationCall__Outputs {
    return new SubmitApplicationCall__Outputs(this);
  }
}

export class SubmitApplicationCall__Inputs {
  _call: SubmitApplicationCall;

  constructor(call: SubmitApplicationCall) {
    this._call = call;
  }

  get _grant(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _workspaceId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _metadataHash(): string {
    return this._call.inputValues[2].value.toString();
  }

  get _milestoneCount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class SubmitApplicationCall__Outputs {
  _call: SubmitApplicationCall;

  constructor(call: SubmitApplicationCall) {
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

export class UpdateApplicationMetadataCall extends ethereum.Call {
  get inputs(): UpdateApplicationMetadataCall__Inputs {
    return new UpdateApplicationMetadataCall__Inputs(this);
  }

  get outputs(): UpdateApplicationMetadataCall__Outputs {
    return new UpdateApplicationMetadataCall__Outputs(this);
  }
}

export class UpdateApplicationMetadataCall__Inputs {
  _call: UpdateApplicationMetadataCall;

  constructor(call: UpdateApplicationMetadataCall) {
    this._call = call;
  }

  get _applicationId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _metadataHash(): string {
    return this._call.inputValues[1].value.toString();
  }

  get _milestoneCount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class UpdateApplicationMetadataCall__Outputs {
  _call: UpdateApplicationMetadataCall;

  constructor(call: UpdateApplicationMetadataCall) {
    this._call = call;
  }
}

export class UpdateApplicationStateCall extends ethereum.Call {
  get inputs(): UpdateApplicationStateCall__Inputs {
    return new UpdateApplicationStateCall__Inputs(this);
  }

  get outputs(): UpdateApplicationStateCall__Outputs {
    return new UpdateApplicationStateCall__Outputs(this);
  }
}

export class UpdateApplicationStateCall__Inputs {
  _call: UpdateApplicationStateCall;

  constructor(call: UpdateApplicationStateCall) {
    this._call = call;
  }

  get _applicationId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _workspaceId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _state(): i32 {
    return this._call.inputValues[2].value.toI32();
  }

  get _reasonMetadataHash(): string {
    return this._call.inputValues[3].value.toString();
  }
}

export class UpdateApplicationStateCall__Outputs {
  _call: UpdateApplicationStateCall;

  constructor(call: UpdateApplicationStateCall) {
    this._call = call;
  }
}
