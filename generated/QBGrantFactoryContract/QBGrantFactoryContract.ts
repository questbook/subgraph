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

export class GrantCreated extends ethereum.Event {
  get params(): GrantCreated__Params {
    return new GrantCreated__Params(this);
  }
}

export class GrantCreated__Params {
  _event: GrantCreated;

  constructor(event: GrantCreated) {
    this._event = event;
  }

  get grantAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get workspaceId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get metadataHash(): string {
    return this._event.parameters[2].value.toString();
  }

  get time(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class GrantCreated1 extends ethereum.Event {
  get params(): GrantCreated1__Params {
    return new GrantCreated1__Params(this);
  }
}

export class GrantCreated1__Params {
  _event: GrantCreated1;

  constructor(event: GrantCreated1) {
    this._event = event;
  }

  get grantAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get workspaceId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get metadataHash(): string {
    return this._event.parameters[2].value.toString();
  }

  get numberOfReviewersPerApplication(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get time(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class GrantImplementationUpdated extends ethereum.Event {
  get params(): GrantImplementationUpdated__Params {
    return new GrantImplementationUpdated__Params(this);
  }
}

export class GrantImplementationUpdated__Params {
  _event: GrantImplementationUpdated;

  constructor(event: GrantImplementationUpdated) {
    this._event = event;
  }

  get grantAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get success(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }

  get data(): Bytes {
    return this._event.parameters[2].value.toBytes();
  }
}

export class GrantUpdatedFromFactory extends ethereum.Event {
  get params(): GrantUpdatedFromFactory__Params {
    return new GrantUpdatedFromFactory__Params(this);
  }
}

export class GrantUpdatedFromFactory__Params {
  _event: GrantUpdatedFromFactory;

  constructor(event: GrantUpdatedFromFactory) {
    this._event = event;
  }

  get grantAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get workspaceId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get metadataHash(): string {
    return this._event.parameters[2].value.toString();
  }

  get active(): boolean {
    return this._event.parameters[3].value.toBoolean();
  }

  get time(): BigInt {
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

export class QBGrantFactoryContract extends ethereum.SmartContract {
  static bind(address: Address): QBGrantFactoryContract {
    return new QBGrantFactoryContract("QBGrantFactoryContract", address);
  }

  applicationReviewReg(): Address {
    let result = super.call(
      "applicationReviewReg",
      "applicationReviewReg():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_applicationReviewReg(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "applicationReviewReg",
      "applicationReviewReg():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  createGrant(
    _workspaceId: BigInt,
    _metadataHash: string,
    _rubricsMetadataHash: string,
    _numberOfReviewersPerApplication: BigInt,
    _workspaceReg: Address,
    _applicationReg: Address
  ): Address {
    let result = super.call(
      "createGrant",
      "createGrant(uint96,string,string,uint96,address,address):(address)",
      [
        ethereum.Value.fromUnsignedBigInt(_workspaceId),
        ethereum.Value.fromString(_metadataHash),
        ethereum.Value.fromString(_rubricsMetadataHash),
        ethereum.Value.fromUnsignedBigInt(_numberOfReviewersPerApplication),
        ethereum.Value.fromAddress(_workspaceReg),
        ethereum.Value.fromAddress(_applicationReg)
      ]
    );

    return result[0].toAddress();
  }

  try_createGrant(
    _workspaceId: BigInt,
    _metadataHash: string,
    _rubricsMetadataHash: string,
    _numberOfReviewersPerApplication: BigInt,
    _workspaceReg: Address,
    _applicationReg: Address
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "createGrant",
      "createGrant(uint96,string,string,uint96,address,address):(address)",
      [
        ethereum.Value.fromUnsignedBigInt(_workspaceId),
        ethereum.Value.fromString(_metadataHash),
        ethereum.Value.fromString(_rubricsMetadataHash),
        ethereum.Value.fromUnsignedBigInt(_numberOfReviewersPerApplication),
        ethereum.Value.fromAddress(_workspaceReg),
        ethereum.Value.fromAddress(_applicationReg)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  grantImplementation(): Address {
    let result = super.call(
      "grantImplementation",
      "grantImplementation():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_grantImplementation(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "grantImplementation",
      "grantImplementation():(address)",
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
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CreateGrantCall extends ethereum.Call {
  get inputs(): CreateGrantCall__Inputs {
    return new CreateGrantCall__Inputs(this);
  }

  get outputs(): CreateGrantCall__Outputs {
    return new CreateGrantCall__Outputs(this);
  }
}

export class CreateGrantCall__Inputs {
  _call: CreateGrantCall;

  constructor(call: CreateGrantCall) {
    this._call = call;
  }

  get _workspaceId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _metadataHash(): string {
    return this._call.inputValues[1].value.toString();
  }

  get _rubricsMetadataHash(): string {
    return this._call.inputValues[2].value.toString();
  }

  get _numberOfReviewersPerApplication(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get _workspaceReg(): Address {
    return this._call.inputValues[4].value.toAddress();
  }

  get _applicationReg(): Address {
    return this._call.inputValues[5].value.toAddress();
  }
}

export class CreateGrantCall__Outputs {
  _call: CreateGrantCall;

  constructor(call: CreateGrantCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.outputValues[0].value.toAddress();
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

export class SetApplicationReviewRegCall extends ethereum.Call {
  get inputs(): SetApplicationReviewRegCall__Inputs {
    return new SetApplicationReviewRegCall__Inputs(this);
  }

  get outputs(): SetApplicationReviewRegCall__Outputs {
    return new SetApplicationReviewRegCall__Outputs(this);
  }
}

export class SetApplicationReviewRegCall__Inputs {
  _call: SetApplicationReviewRegCall;

  constructor(call: SetApplicationReviewRegCall) {
    this._call = call;
  }

  get _applicationReviewReg(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetApplicationReviewRegCall__Outputs {
  _call: SetApplicationReviewRegCall;

  constructor(call: SetApplicationReviewRegCall) {
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

  get grantAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _workspaceId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _workspaceReg(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _metadataHash(): string {
    return this._call.inputValues[3].value.toString();
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

  get grantAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _workspaceId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _workspaceReg(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _canAcceptApplication(): boolean {
    return this._call.inputValues[3].value.toBoolean();
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
