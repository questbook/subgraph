// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  Address,
  DataSourceTemplate,
  DataSourceContext
} from "@graphprotocol/graph-ts";

export class QBGrantsContract extends DataSourceTemplate {
  static create(address: Address): void {
    DataSourceTemplate.create("QBGrantsContract", [address.toHex()]);
  }

  static createWithContext(address: Address, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext(
      "QBGrantsContract",
      [address.toHex()],
      context
    );
  }
}

export class PIICollection extends DataSourceTemplate {
  static create(cid: string): void {
    DataSourceTemplate.create("PIICollection", [cid]);
  }

  static createWithContext(cid: string, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext("PIICollection", [cid], context);
  }
}

export class WorkspaceMetadata extends DataSourceTemplate {
  static create(cid: string): void {
    DataSourceTemplate.create("WorkspaceMetadata", [cid]);
  }

  static createWithContext(cid: string, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext("WorkspaceMetadata", [cid], context);
  }
}

export class WorkspaceMemberMetadata extends DataSourceTemplate {
  static create(cid: string): void {
    DataSourceTemplate.create("WorkspaceMemberMetadata", [cid]);
  }

  static createWithContext(cid: string, context: DataSourceContext): void {
    DataSourceTemplate.createWithContext(
      "WorkspaceMemberMetadata",
      [cid],
      context
    );
  }
}
