// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Social extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("name", Value.fromString(""));
    this.set("value", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Social entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Social entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Social", id.toString(), this);
    }
  }

  static load(id: string): Social | null {
    return changetype<Social | null>(store.get("Social", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    return value!.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get value(): string {
    let value = this.get("value");
    return value!.toString();
  }

  set value(value: string) {
    this.set("value", Value.fromString(value));
  }
}

export class GrantField extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("title", Value.fromString(""));
    this.set("inputType", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save GrantField entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save GrantField entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("GrantField", id.toString(), this);
    }
  }

  static load(id: string): GrantField | null {
    return changetype<GrantField | null>(store.get("GrantField", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get title(): string {
    let value = this.get("title");
    return value!.toString();
  }

  set title(value: string) {
    this.set("title", Value.fromString(value));
  }

  get inputType(): string {
    let value = this.get("inputType");
    return value!.toString();
  }

  set inputType(value: string) {
    this.set("inputType", Value.fromString(value));
  }

  get possibleValues(): Array<string> | null {
    let value = this.get("possibleValues");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set possibleValues(value: Array<string> | null) {
    if (!value) {
      this.unset("possibleValues");
    } else {
      this.set("possibleValues", Value.fromStringArray(<Array<string>>value));
    }
  }
}

export class GrantFieldAnswer extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("field", Value.fromString(""));
    this.set("value", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save GrantFieldAnswer entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save GrantFieldAnswer entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("GrantFieldAnswer", id.toString(), this);
    }
  }

  static load(id: string): GrantFieldAnswer | null {
    return changetype<GrantFieldAnswer | null>(
      store.get("GrantFieldAnswer", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get field(): string {
    let value = this.get("field");
    return value!.toString();
  }

  set field(value: string) {
    this.set("field", Value.fromString(value));
  }

  get value(): string {
    let value = this.get("value");
    return value!.toString();
  }

  set value(value: string) {
    this.set("value", Value.fromString(value));
  }
}

export class Reward extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("asset", Value.fromBytes(Bytes.empty()));
    this.set("committed", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Reward entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Reward entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Reward", id.toString(), this);
    }
  }

  static load(id: string): Reward | null {
    return changetype<Reward | null>(store.get("Reward", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get asset(): Bytes {
    let value = this.get("asset");
    return value!.toBytes();
  }

  set asset(value: Bytes) {
    this.set("asset", Value.fromBytes(value));
  }

  get committed(): BigInt {
    let value = this.get("committed");
    return value!.toBigInt();
  }

  set committed(value: BigInt) {
    this.set("committed", Value.fromBigInt(value));
  }
}

export class Grant extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("creatorId", Value.fromBytes(Bytes.empty()));
    this.set("title", Value.fromString(""));
    this.set("summary", Value.fromString(""));
    this.set("details", Value.fromString(""));
    this.set("reward", Value.fromString(""));
    this.set("fields", Value.fromStringArray(new Array(0)));
    this.set("metadataHash", Value.fromString(""));
    this.set("funding", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Grant entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Grant entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Grant", id.toString(), this);
    }
  }

  static load(id: string): Grant | null {
    return changetype<Grant | null>(store.get("Grant", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get creatorId(): Bytes {
    let value = this.get("creatorId");
    return value!.toBytes();
  }

  set creatorId(value: Bytes) {
    this.set("creatorId", Value.fromBytes(value));
  }

  get title(): string {
    let value = this.get("title");
    return value!.toString();
  }

  set title(value: string) {
    this.set("title", Value.fromString(value));
  }

  get summary(): string {
    let value = this.get("summary");
    return value!.toString();
  }

  set summary(value: string) {
    this.set("summary", Value.fromString(value));
  }

  get details(): string {
    let value = this.get("details");
    return value!.toString();
  }

  set details(value: string) {
    this.set("details", Value.fromString(value));
  }

  get reward(): string {
    let value = this.get("reward");
    return value!.toString();
  }

  set reward(value: string) {
    this.set("reward", Value.fromString(value));
  }

  get workspace(): string | null {
    let value = this.get("workspace");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set workspace(value: string | null) {
    if (!value) {
      this.unset("workspace");
    } else {
      this.set("workspace", Value.fromString(<string>value));
    }
  }

  get deadline(): string | null {
    let value = this.get("deadline");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set deadline(value: string | null) {
    if (!value) {
      this.unset("deadline");
    } else {
      this.set("deadline", Value.fromString(<string>value));
    }
  }

  get fields(): Array<string> {
    let value = this.get("fields");
    return value!.toStringArray();
  }

  set fields(value: Array<string>) {
    this.set("fields", Value.fromStringArray(value));
  }

  get acceptingApplications(): boolean {
    let value = this.get("acceptingApplications");
    return value!.toBoolean();
  }

  set acceptingApplications(value: boolean) {
    this.set("acceptingApplications", Value.fromBoolean(value));
  }

  get metadataHash(): string {
    let value = this.get("metadataHash");
    return value!.toString();
  }

  set metadataHash(value: string) {
    this.set("metadataHash", Value.fromString(value));
  }

  get createdAtS(): i32 {
    let value = this.get("createdAtS");
    return value!.toI32();
  }

  set createdAtS(value: i32) {
    this.set("createdAtS", Value.fromI32(value));
  }

  get updatedAtS(): i32 {
    let value = this.get("updatedAtS");
    return value!.toI32();
  }

  set updatedAtS(value: i32) {
    this.set("updatedAtS", Value.fromI32(value));
  }

  get funding(): BigInt {
    let value = this.get("funding");
    return value!.toBigInt();
  }

  set funding(value: BigInt) {
    this.set("funding", Value.fromBigInt(value));
  }
}

export class WorkspaceMember extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("actorId", Value.fromBytes(Bytes.empty()));
    this.set("accessLevel", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save WorkspaceMember entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save WorkspaceMember entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("WorkspaceMember", id.toString(), this);
    }
  }

  static load(id: string): WorkspaceMember | null {
    return changetype<WorkspaceMember | null>(store.get("WorkspaceMember", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get actorId(): Bytes {
    let value = this.get("actorId");
    return value!.toBytes();
  }

  set actorId(value: Bytes) {
    this.set("actorId", Value.fromBytes(value));
  }

  get email(): string | null {
    let value = this.get("email");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set email(value: string | null) {
    if (!value) {
      this.unset("email");
    } else {
      this.set("email", Value.fromString(<string>value));
    }
  }

  get accessLevel(): string {
    let value = this.get("accessLevel");
    return value!.toString();
  }

  set accessLevel(value: string) {
    this.set("accessLevel", Value.fromString(value));
  }
}

export class Workspace extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("ownerId", Value.fromBytes(Bytes.empty()));
    this.set("title", Value.fromString(""));
    this.set("about", Value.fromString(""));
    this.set("logoIpfsHash", Value.fromString(""));
    this.set("coverImageIpfsHash", Value.fromString(""));
    this.set("supportedNetworks", Value.fromBytesArray(new Array(0)));
    this.set("members", Value.fromStringArray(new Array(0)));
    this.set("socials", Value.fromStringArray(new Array(0)));
    this.set("metadataHash", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Workspace entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Workspace entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Workspace", id.toString(), this);
    }
  }

  static load(id: string): Workspace | null {
    return changetype<Workspace | null>(store.get("Workspace", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get ownerId(): Bytes {
    let value = this.get("ownerId");
    return value!.toBytes();
  }

  set ownerId(value: Bytes) {
    this.set("ownerId", Value.fromBytes(value));
  }

  get title(): string {
    let value = this.get("title");
    return value!.toString();
  }

  set title(value: string) {
    this.set("title", Value.fromString(value));
  }

  get about(): string {
    let value = this.get("about");
    return value!.toString();
  }

  set about(value: string) {
    this.set("about", Value.fromString(value));
  }

  get logoIpfsHash(): string {
    let value = this.get("logoIpfsHash");
    return value!.toString();
  }

  set logoIpfsHash(value: string) {
    this.set("logoIpfsHash", Value.fromString(value));
  }

  get coverImageIpfsHash(): string {
    let value = this.get("coverImageIpfsHash");
    return value!.toString();
  }

  set coverImageIpfsHash(value: string) {
    this.set("coverImageIpfsHash", Value.fromString(value));
  }

  get supportedNetworks(): Array<Bytes> {
    let value = this.get("supportedNetworks");
    return value!.toBytesArray();
  }

  set supportedNetworks(value: Array<Bytes>) {
    this.set("supportedNetworks", Value.fromBytesArray(value));
  }

  get createdAtS(): i32 {
    let value = this.get("createdAtS");
    return value!.toI32();
  }

  set createdAtS(value: i32) {
    this.set("createdAtS", Value.fromI32(value));
  }

  get updatedAtS(): i32 {
    let value = this.get("updatedAtS");
    return value!.toI32();
  }

  set updatedAtS(value: i32) {
    this.set("updatedAtS", Value.fromI32(value));
  }

  get members(): Array<string> {
    let value = this.get("members");
    return value!.toStringArray();
  }

  set members(value: Array<string>) {
    this.set("members", Value.fromStringArray(value));
  }

  get socials(): Array<string> {
    let value = this.get("socials");
    return value!.toStringArray();
  }

  set socials(value: Array<string>) {
    this.set("socials", Value.fromStringArray(value));
  }

  get metadataHash(): string {
    let value = this.get("metadataHash");
    return value!.toString();
  }

  set metadataHash(value: string) {
    this.set("metadataHash", Value.fromString(value));
  }
}

export class ApplicationMilestone extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("state", Value.fromString(""));
    this.set("title", Value.fromString(""));
    this.set("amount", Value.fromBigInt(BigInt.zero()));
    this.set("amountPaid", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ApplicationMilestone entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save ApplicationMilestone entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("ApplicationMilestone", id.toString(), this);
    }
  }

  static load(id: string): ApplicationMilestone | null {
    return changetype<ApplicationMilestone | null>(
      store.get("ApplicationMilestone", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get state(): string {
    let value = this.get("state");
    return value!.toString();
  }

  set state(value: string) {
    this.set("state", Value.fromString(value));
  }

  get title(): string {
    let value = this.get("title");
    return value!.toString();
  }

  set title(value: string) {
    this.set("title", Value.fromString(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value!.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get amountPaid(): BigInt {
    let value = this.get("amountPaid");
    return value!.toBigInt();
  }

  set amountPaid(value: BigInt) {
    this.set("amountPaid", Value.fromBigInt(value));
  }

  get updatedAtS(): i32 {
    let value = this.get("updatedAtS");
    return value!.toI32();
  }

  set updatedAtS(value: i32) {
    this.set("updatedAtS", Value.fromI32(value));
  }

  get text(): string | null {
    let value = this.get("text");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set text(value: string | null) {
    if (!value) {
      this.unset("text");
    } else {
      this.set("text", Value.fromString(<string>value));
    }
  }
}

export class ApplicationMember extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("details", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ApplicationMember entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save ApplicationMember entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("ApplicationMember", id.toString(), this);
    }
  }

  static load(id: string): ApplicationMember | null {
    return changetype<ApplicationMember | null>(
      store.get("ApplicationMember", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get details(): string {
    let value = this.get("details");
    return value!.toString();
  }

  set details(value: string) {
    this.set("details", Value.fromString(value));
  }
}

export class GrantApplication extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("grant", Value.fromString(""));
    this.set("applicantId", Value.fromBytes(Bytes.empty()));
    this.set("state", Value.fromString(""));
    this.set("details", Value.fromString(""));
    this.set("fields", Value.fromStringArray(new Array(0)));
    this.set("members", Value.fromStringArray(new Array(0)));
    this.set("milestones", Value.fromStringArray(new Array(0)));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save GrantApplication entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save GrantApplication entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("GrantApplication", id.toString(), this);
    }
  }

  static load(id: string): GrantApplication | null {
    return changetype<GrantApplication | null>(
      store.get("GrantApplication", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get grant(): string {
    let value = this.get("grant");
    return value!.toString();
  }

  set grant(value: string) {
    this.set("grant", Value.fromString(value));
  }

  get applicantId(): Bytes {
    let value = this.get("applicantId");
    return value!.toBytes();
  }

  set applicantId(value: Bytes) {
    this.set("applicantId", Value.fromBytes(value));
  }

  get state(): string {
    let value = this.get("state");
    return value!.toString();
  }

  set state(value: string) {
    this.set("state", Value.fromString(value));
  }

  get details(): string {
    let value = this.get("details");
    return value!.toString();
  }

  set details(value: string) {
    this.set("details", Value.fromString(value));
  }

  get fields(): Array<string> {
    let value = this.get("fields");
    return value!.toStringArray();
  }

  set fields(value: Array<string>) {
    this.set("fields", Value.fromStringArray(value));
  }

  get members(): Array<string> {
    let value = this.get("members");
    return value!.toStringArray();
  }

  set members(value: Array<string>) {
    this.set("members", Value.fromStringArray(value));
  }

  get createdAtS(): i32 {
    let value = this.get("createdAtS");
    return value!.toI32();
  }

  set createdAtS(value: i32) {
    this.set("createdAtS", Value.fromI32(value));
  }

  get updatedAtS(): i32 {
    let value = this.get("updatedAtS");
    return value!.toI32();
  }

  set updatedAtS(value: i32) {
    this.set("updatedAtS", Value.fromI32(value));
  }

  get milestones(): Array<string> {
    let value = this.get("milestones");
    return value!.toStringArray();
  }

  set milestones(value: Array<string>) {
    this.set("milestones", Value.fromStringArray(value));
  }
}

export class FundsDeposit extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("grant", Value.fromString(""));
    this.set("amount", Value.fromBigInt(BigInt.zero()));
    this.set("from", Value.fromBytes(Bytes.empty()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save FundsDeposit entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save FundsDeposit entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("FundsDeposit", id.toString(), this);
    }
  }

  static load(id: string): FundsDeposit | null {
    return changetype<FundsDeposit | null>(store.get("FundsDeposit", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get grant(): string {
    let value = this.get("grant");
    return value!.toString();
  }

  set grant(value: string) {
    this.set("grant", Value.fromString(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value!.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get from(): Bytes {
    let value = this.get("from");
    return value!.toBytes();
  }

  set from(value: Bytes) {
    this.set("from", Value.fromBytes(value));
  }

  get createdAtS(): i32 {
    let value = this.get("createdAtS");
    return value!.toI32();
  }

  set createdAtS(value: i32) {
    this.set("createdAtS", Value.fromI32(value));
  }
}

export class FundsDisburse extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("application", Value.fromString(""));
    this.set("milestone", Value.fromString(""));
    this.set("amount", Value.fromBigInt(BigInt.zero()));
    this.set("to", Value.fromBytes(Bytes.empty()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save FundsDisburse entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save FundsDisburse entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("FundsDisburse", id.toString(), this);
    }
  }

  static load(id: string): FundsDisburse | null {
    return changetype<FundsDisburse | null>(store.get("FundsDisburse", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get application(): string {
    let value = this.get("application");
    return value!.toString();
  }

  set application(value: string) {
    this.set("application", Value.fromString(value));
  }

  get milestone(): string {
    let value = this.get("milestone");
    return value!.toString();
  }

  set milestone(value: string) {
    this.set("milestone", Value.fromString(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value!.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get to(): Bytes {
    let value = this.get("to");
    return value!.toBytes();
  }

  set to(value: Bytes) {
    this.set("to", Value.fromBytes(value));
  }

  get createdAtS(): i32 {
    let value = this.get("createdAtS");
    return value!.toI32();
  }

  set createdAtS(value: i32) {
    this.set("createdAtS", Value.fromI32(value));
  }
}

export class Notification extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("title", Value.fromString(""));
    this.set("content", Value.fromString(""));
    this.set("type", Value.fromString(""));
    this.set("entityId", Value.fromString(""));
    this.set("recipientIds", Value.fromStringArray(new Array(0)));
    this.set("cursor", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Notification entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Notification entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Notification", id.toString(), this);
    }
  }

  static load(id: string): Notification | null {
    return changetype<Notification | null>(store.get("Notification", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get title(): string {
    let value = this.get("title");
    return value!.toString();
  }

  set title(value: string) {
    this.set("title", Value.fromString(value));
  }

  get content(): string {
    let value = this.get("content");
    return value!.toString();
  }

  set content(value: string) {
    this.set("content", Value.fromString(value));
  }

  get type(): string {
    let value = this.get("type");
    return value!.toString();
  }

  set type(value: string) {
    this.set("type", Value.fromString(value));
  }

  get entityId(): string {
    let value = this.get("entityId");
    return value!.toString();
  }

  set entityId(value: string) {
    this.set("entityId", Value.fromString(value));
  }

  get recipientIds(): Array<string> {
    let value = this.get("recipientIds");
    return value!.toStringArray();
  }

  set recipientIds(value: Array<string>) {
    this.set("recipientIds", Value.fromStringArray(value));
  }

  get actorId(): string | null {
    let value = this.get("actorId");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set actorId(value: string | null) {
    if (!value) {
      this.unset("actorId");
    } else {
      this.set("actorId", Value.fromString(<string>value));
    }
  }

  get cursor(): string {
    let value = this.get("cursor");
    return value!.toString();
  }

  set cursor(value: string) {
    this.set("cursor", Value.fromString(value));
  }
}
