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

export class ReviewMigrate extends ethereum.Event {
  get params(): ReviewMigrate__Params {
    return new ReviewMigrate__Params(this);
  }
}

export class ReviewMigrate__Params {
  _event: ReviewMigrate;

  constructor(event: ReviewMigrate) {
    this._event = event;
  }

  get _reviewId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get _applicationId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get _previousReviewerAddress(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get _newReviewerAddress(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get time(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class ReviewPaymentFulfilled extends ethereum.Event {
  get params(): ReviewPaymentFulfilled__Params {
    return new ReviewPaymentFulfilled__Params(this);
  }
}

export class ReviewPaymentFulfilled__Params {
  _event: ReviewPaymentFulfilled;

  constructor(event: ReviewPaymentFulfilled) {
    this._event = event;
  }

  get _reviewIds(): Array<BigInt> {
    return this._event.parameters[0].value.toBigIntArray();
  }

  get _asset(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _sender(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get _reviewer(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get _amount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get time(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class ReviewPaymentMarkedDone extends ethereum.Event {
  get params(): ReviewPaymentMarkedDone__Params {
    return new ReviewPaymentMarkedDone__Params(this);
  }
}

export class ReviewPaymentMarkedDone__Params {
  _event: ReviewPaymentMarkedDone;

  constructor(event: ReviewPaymentMarkedDone) {
    this._event = event;
  }

  get _reviewIds(): Array<BigInt> {
    return this._event.parameters[0].value.toBigIntArray();
  }

  get _asset(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _reviewer(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get _amount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get _transactionHash(): string {
    return this._event.parameters[4].value.toString();
  }

  get time(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class ReviewSubmitted extends ethereum.Event {
  get params(): ReviewSubmitted__Params {
    return new ReviewSubmitted__Params(this);
  }
}

export class ReviewSubmitted__Params {
  _event: ReviewSubmitted;

  constructor(event: ReviewSubmitted) {
    this._event = event;
  }

  get _reviewId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get _reviewerAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _workspaceId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get _applicationId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get _grantAddress(): Address {
    return this._event.parameters[4].value.toAddress();
  }

  get _metadataHash(): string {
    return this._event.parameters[5].value.toString();
  }

  get time(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }
}

export class ReviewersAssigned extends ethereum.Event {
  get params(): ReviewersAssigned__Params {
    return new ReviewersAssigned__Params(this);
  }
}

export class ReviewersAssigned__Params {
  _event: ReviewersAssigned;

  constructor(event: ReviewersAssigned) {
    this._event = event;
  }

  get _reviewIds(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get _workspaceId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get _applicationId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get _grantAddress(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get _reviewers(): Array<Address> {
    return this._event.parameters[4].value.toAddressArray();
  }

  get _active(): Array<boolean> {
    return this._event.parameters[5].value.toBooleanArray();
  }

  get time(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }
}

export class RubricsSet extends ethereum.Event {
  get params(): RubricsSet__Params {
    return new RubricsSet__Params(this);
  }
}

export class RubricsSet__Params {
  _event: RubricsSet;

  constructor(event: RubricsSet) {
    this._event = event;
  }

  get _workspaceId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get _grantAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _metadataHash(): string {
    return this._event.parameters[2].value.toString();
  }

  get time(): BigInt {
    return this._event.parameters[3].value.toBigInt();
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

export class QBReviewsContract__grantReviewStatesResult {
  value0: Address;
  value1: BigInt;
  value2: BigInt;
  value3: string;
  value4: BigInt;

  constructor(
    value0: Address,
    value1: BigInt,
    value2: BigInt,
    value3: string,
    value4: BigInt
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromString(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    return map;
  }
}

export class QBReviewsContract__reviewsResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: Address;
  value4: Address;
  value5: string;
  value6: boolean;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: BigInt,
    value3: Address,
    value4: Address,
    value5: string,
    value6: boolean
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
    this.value6 = value6;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromAddress(this.value3));
    map.set("value4", ethereum.Value.fromAddress(this.value4));
    map.set("value5", ethereum.Value.fromString(this.value5));
    map.set("value6", ethereum.Value.fromBoolean(this.value6));
    return map;
  }
}

export class QBReviewsContract extends ethereum.SmartContract {
  static bind(address: Address): QBReviewsContract {
    return new QBReviewsContract("QBReviewsContract", address);
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

  applicationsToGrant(param0: Address, param1: BigInt): BigInt {
    let result = super.call(
      "applicationsToGrant",
      "applicationsToGrant(address,uint256):(uint96)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return result[0].toBigInt();
  }

  try_applicationsToGrant(
    param0: Address,
    param1: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "applicationsToGrant",
      "applicationsToGrant(address,uint256):(uint96)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
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

  grantReviewStates(
    param0: Address
  ): QBReviewsContract__grantReviewStatesResult {
    let result = super.call(
      "grantReviewStates",
      "grantReviewStates(address):(address,uint96,uint96,string,uint96)",
      [ethereum.Value.fromAddress(param0)]
    );

    return new QBReviewsContract__grantReviewStatesResult(
      result[0].toAddress(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toString(),
      result[4].toBigInt()
    );
  }

  try_grantReviewStates(
    param0: Address
  ): ethereum.CallResult<QBReviewsContract__grantReviewStatesResult> {
    let result = super.tryCall(
      "grantReviewStates",
      "grantReviewStates(address):(address,uint96,uint96,string,uint96)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new QBReviewsContract__grantReviewStatesResult(
        value[0].toAddress(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toString(),
        value[4].toBigInt()
      )
    );
  }

  isAutoAssigningEnabled(param0: Address): boolean {
    let result = super.call(
      "isAutoAssigningEnabled",
      "isAutoAssigningEnabled(address):(bool)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toBoolean();
  }

  try_isAutoAssigningEnabled(param0: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isAutoAssigningEnabled",
      "isAutoAssigningEnabled(address):(bool)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  lastAssignedApplicationIndices(param0: Address): BigInt {
    let result = super.call(
      "lastAssignedApplicationIndices",
      "lastAssignedApplicationIndices(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toBigInt();
  }

  try_lastAssignedApplicationIndices(
    param0: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "lastAssignedApplicationIndices",
      "lastAssignedApplicationIndices(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  lastAssignedReviewerIndices(param0: Address): BigInt {
    let result = super.call(
      "lastAssignedReviewerIndices",
      "lastAssignedReviewerIndices(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toBigInt();
  }

  try_lastAssignedReviewerIndices(
    param0: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "lastAssignedReviewerIndices",
      "lastAssignedReviewerIndices(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );
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

  reviewCount(): BigInt {
    let result = super.call("reviewCount", "reviewCount():(uint96)", []);

    return result[0].toBigInt();
  }

  try_reviewCount(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("reviewCount", "reviewCount():(uint96)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  reviewPaymentsStatus(param0: BigInt): boolean {
    let result = super.call(
      "reviewPaymentsStatus",
      "reviewPaymentsStatus(uint96):(bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return result[0].toBoolean();
  }

  try_reviewPaymentsStatus(param0: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "reviewPaymentsStatus",
      "reviewPaymentsStatus(uint96):(bool)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  reviewerAssignmentCounts(param0: Address, param1: Address): BigInt {
    let result = super.call(
      "reviewerAssignmentCounts",
      "reviewerAssignmentCounts(address,address):(uint96)",
      [ethereum.Value.fromAddress(param0), ethereum.Value.fromAddress(param1)]
    );

    return result[0].toBigInt();
  }

  try_reviewerAssignmentCounts(
    param0: Address,
    param1: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "reviewerAssignmentCounts",
      "reviewerAssignmentCounts(address,address):(uint96)",
      [ethereum.Value.fromAddress(param0), ethereum.Value.fromAddress(param1)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  reviewers(param0: Address, param1: BigInt): Address {
    let result = super.call(
      "reviewers",
      "reviewers(address,uint256):(address)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return result[0].toAddress();
  }

  try_reviewers(param0: Address, param1: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "reviewers",
      "reviewers(address,uint256):(address)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  reviews(param0: Address, param1: BigInt): QBReviewsContract__reviewsResult {
    let result = super.call(
      "reviews",
      "reviews(address,uint96):(uint96,uint96,uint96,address,address,string,bool)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return new QBReviewsContract__reviewsResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toAddress(),
      result[4].toAddress(),
      result[5].toString(),
      result[6].toBoolean()
    );
  }

  try_reviews(
    param0: Address,
    param1: BigInt
  ): ethereum.CallResult<QBReviewsContract__reviewsResult> {
    let result = super.tryCall(
      "reviews",
      "reviews(address,uint96):(uint96,uint96,uint96,address,address,string,bool)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new QBReviewsContract__reviewsResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toAddress(),
        value[4].toAddress(),
        value[5].toString(),
        value[6].toBoolean()
      )
    );
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

export class AssignAndReviewCall extends ethereum.Call {
  get inputs(): AssignAndReviewCall__Inputs {
    return new AssignAndReviewCall__Inputs(this);
  }

  get outputs(): AssignAndReviewCall__Outputs {
    return new AssignAndReviewCall__Outputs(this);
  }
}

export class AssignAndReviewCall__Inputs {
  _call: AssignAndReviewCall;

  constructor(call: AssignAndReviewCall) {
    this._call = call;
  }

  get _workspaceId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _applicationId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _grantAddress(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _reviewer(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get _active(): boolean {
    return this._call.inputValues[4].value.toBoolean();
  }

  get _reviewMetadataHash(): string {
    return this._call.inputValues[5].value.toString();
  }
}

export class AssignAndReviewCall__Outputs {
  _call: AssignAndReviewCall;

  constructor(call: AssignAndReviewCall) {
    this._call = call;
  }
}

export class AssignReviewersCall extends ethereum.Call {
  get inputs(): AssignReviewersCall__Inputs {
    return new AssignReviewersCall__Inputs(this);
  }

  get outputs(): AssignReviewersCall__Outputs {
    return new AssignReviewersCall__Outputs(this);
  }
}

export class AssignReviewersCall__Inputs {
  _call: AssignReviewersCall;

  constructor(call: AssignReviewersCall) {
    this._call = call;
  }

  get _workspaceId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _applicationId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _grantAddress(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _reviewers(): Array<Address> {
    return this._call.inputValues[3].value.toAddressArray();
  }

  get _active(): Array<boolean> {
    return this._call.inputValues[4].value.toBooleanArray();
  }
}

export class AssignReviewersCall__Outputs {
  _call: AssignReviewersCall;

  constructor(call: AssignReviewersCall) {
    this._call = call;
  }
}

export class AssignReviewersBatchCall extends ethereum.Call {
  get inputs(): AssignReviewersBatchCall__Inputs {
    return new AssignReviewersBatchCall__Inputs(this);
  }

  get outputs(): AssignReviewersBatchCall__Outputs {
    return new AssignReviewersBatchCall__Outputs(this);
  }
}

export class AssignReviewersBatchCall__Inputs {
  _call: AssignReviewersBatchCall;

  constructor(call: AssignReviewersBatchCall) {
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

  get _reviewers(): Array<Address> {
    return this._call.inputValues[3].value.toAddressArray();
  }

  get _active(): Array<boolean> {
    return this._call.inputValues[4].value.toBooleanArray();
  }
}

export class AssignReviewersBatchCall__Outputs {
  _call: AssignReviewersBatchCall;

  constructor(call: AssignReviewersBatchCall) {
    this._call = call;
  }
}

export class FulfillPaymentCall extends ethereum.Call {
  get inputs(): FulfillPaymentCall__Inputs {
    return new FulfillPaymentCall__Inputs(this);
  }

  get outputs(): FulfillPaymentCall__Outputs {
    return new FulfillPaymentCall__Outputs(this);
  }
}

export class FulfillPaymentCall__Inputs {
  _call: FulfillPaymentCall;

  constructor(call: FulfillPaymentCall) {
    this._call = call;
  }

  get _workspaceId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _applicationIds(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }

  get _reviewer(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _reviewIds(): Array<BigInt> {
    return this._call.inputValues[3].value.toBigIntArray();
  }

  get _erc20Interface(): Address {
    return this._call.inputValues[4].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }
}

export class FulfillPaymentCall__Outputs {
  _call: FulfillPaymentCall;

  constructor(call: FulfillPaymentCall) {
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

export class MarkPaymentDoneCall extends ethereum.Call {
  get inputs(): MarkPaymentDoneCall__Inputs {
    return new MarkPaymentDoneCall__Inputs(this);
  }

  get outputs(): MarkPaymentDoneCall__Outputs {
    return new MarkPaymentDoneCall__Outputs(this);
  }
}

export class MarkPaymentDoneCall__Inputs {
  _call: MarkPaymentDoneCall;

  constructor(call: MarkPaymentDoneCall) {
    this._call = call;
  }

  get _workspaceId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _applicationIds(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }

  get _reviewer(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _reviewIds(): Array<BigInt> {
    return this._call.inputValues[3].value.toBigIntArray();
  }

  get _erc20Interface(): Address {
    return this._call.inputValues[4].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get _transactionHash(): string {
    return this._call.inputValues[6].value.toString();
  }
}

export class MarkPaymentDoneCall__Outputs {
  _call: MarkPaymentDoneCall;

  constructor(call: MarkPaymentDoneCall) {
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

  get appId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class MigrateWalletCall__Outputs {
  _call: MigrateWalletCall;

  constructor(call: MigrateWalletCall) {
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

export class SetGrantFactoryCall extends ethereum.Call {
  get inputs(): SetGrantFactoryCall__Inputs {
    return new SetGrantFactoryCall__Inputs(this);
  }

  get outputs(): SetGrantFactoryCall__Outputs {
    return new SetGrantFactoryCall__Outputs(this);
  }
}

export class SetGrantFactoryCall__Inputs {
  _call: SetGrantFactoryCall;

  constructor(call: SetGrantFactoryCall) {
    this._call = call;
  }

  get _grantFactory(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetGrantFactoryCall__Outputs {
  _call: SetGrantFactoryCall;

  constructor(call: SetGrantFactoryCall) {
    this._call = call;
  }
}

export class SetRubricsCall extends ethereum.Call {
  get inputs(): SetRubricsCall__Inputs {
    return new SetRubricsCall__Inputs(this);
  }

  get outputs(): SetRubricsCall__Outputs {
    return new SetRubricsCall__Outputs(this);
  }
}

export class SetRubricsCall__Inputs {
  _call: SetRubricsCall;

  constructor(call: SetRubricsCall) {
    this._call = call;
  }

  get _workspaceId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _grantAddress(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _metadataHash(): string {
    return this._call.inputValues[2].value.toString();
  }
}

export class SetRubricsCall__Outputs {
  _call: SetRubricsCall;

  constructor(call: SetRubricsCall) {
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

export class SubmitReviewCall extends ethereum.Call {
  get inputs(): SubmitReviewCall__Inputs {
    return new SubmitReviewCall__Inputs(this);
  }

  get outputs(): SubmitReviewCall__Outputs {
    return new SubmitReviewCall__Outputs(this);
  }
}

export class SubmitReviewCall__Inputs {
  _call: SubmitReviewCall;

  constructor(call: SubmitReviewCall) {
    this._call = call;
  }

  get _workspaceId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _applicationId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _grantAddress(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _metadataHash(): string {
    return this._call.inputValues[3].value.toString();
  }
}

export class SubmitReviewCall__Outputs {
  _call: SubmitReviewCall;

  constructor(call: SubmitReviewCall) {
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
