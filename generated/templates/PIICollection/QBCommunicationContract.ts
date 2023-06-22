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

export class CommentAdded extends ethereum.Event {
  get params(): CommentAdded__Params {
    return new CommentAdded__Params(this);
  }
}

export class CommentAdded__Params {
  _event: CommentAdded;

  constructor(event: CommentAdded) {
    this._event = event;
  }

  get workspaceId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get grantAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get applicationId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get isPrivate(): boolean {
    return this._event.parameters[3].value.toBoolean();
  }

  get commentMetadataHash(): string {
    return this._event.parameters[4].value.toString();
  }

  get sender(): Address {
    return this._event.parameters[5].value.toAddress();
  }

  get timestamp(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }
}

export class EmailAdded extends ethereum.Event {
  get params(): EmailAdded__Params {
    return new EmailAdded__Params(this);
  }
}

export class EmailAdded__Params {
  _event: EmailAdded;

  constructor(event: EmailAdded) {
    this._event = event;
  }

  get chainId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get emailHash(): string {
    return this._event.parameters[1].value.toString();
  }

  get message(): string {
    return this._event.parameters[2].value.toString();
  }

  get sender(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get timestamp(): BigInt {
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

export class QBCommunicationContract extends ethereum.SmartContract {
  static bind(address: Address): QBCommunicationContract {
    return new QBCommunicationContract("QBCommunicationContract", address);
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

export class AddCommentCall extends ethereum.Call {
  get inputs(): AddCommentCall__Inputs {
    return new AddCommentCall__Inputs(this);
  }

  get outputs(): AddCommentCall__Outputs {
    return new AddCommentCall__Outputs(this);
  }
}

export class AddCommentCall__Inputs {
  _call: AddCommentCall;

  constructor(call: AddCommentCall) {
    this._call = call;
  }

  get _workspaceId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _grantAddress(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _applicationId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _isPrivate(): boolean {
    return this._call.inputValues[3].value.toBoolean();
  }

  get _commentMetadataHash(): string {
    return this._call.inputValues[4].value.toString();
  }
}

export class AddCommentCall__Outputs {
  _call: AddCommentCall;

  constructor(call: AddCommentCall) {
    this._call = call;
  }
}

export class AddCommentsCall extends ethereum.Call {
  get inputs(): AddCommentsCall__Inputs {
    return new AddCommentsCall__Inputs(this);
  }

  get outputs(): AddCommentsCall__Outputs {
    return new AddCommentsCall__Outputs(this);
  }
}

export class AddCommentsCall__Inputs {
  _call: AddCommentsCall;

  constructor(call: AddCommentsCall) {
    this._call = call;
  }

  get _workspaceId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _grantAddress(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _applicationIds(): Array<BigInt> {
    return this._call.inputValues[2].value.toBigIntArray();
  }

  get _isPrivate(): boolean {
    return this._call.inputValues[3].value.toBoolean();
  }

  get _commentMetadataHashes(): Array<string> {
    return this._call.inputValues[4].value.toStringArray();
  }
}

export class AddCommentsCall__Outputs {
  _call: AddCommentsCall;

  constructor(call: AddCommentsCall) {
    this._call = call;
  }
}

export class CreateLinkCall extends ethereum.Call {
  get inputs(): CreateLinkCall__Inputs {
    return new CreateLinkCall__Inputs(this);
  }

  get outputs(): CreateLinkCall__Outputs {
    return new CreateLinkCall__Outputs(this);
  }
}

export class CreateLinkCall__Inputs {
  _call: CreateLinkCall;

  constructor(call: CreateLinkCall) {
    this._call = call;
  }

  get _chainId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _emailHash(): string {
    return this._call.inputValues[1].value.toString();
  }

  get _message(): string {
    return this._call.inputValues[2].value.toString();
  }
}

export class CreateLinkCall__Outputs {
  _call: CreateLinkCall;

  constructor(call: CreateLinkCall) {
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
