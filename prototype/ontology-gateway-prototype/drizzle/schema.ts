import {
  boolean,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  enterpriseRole: mysqlEnum("enterpriseRole", [
    "business_employee",
    "supervisor",
    "ontology_builder",
    "developer_governance",
  ])
    .default("business_employee")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const ontologyVersions = mysqlTable(
  "ontologyVersions",
  {
    id: int("id").autoincrement().primaryKey(),
    version: varchar("version", { length: 32 }).notNull(),
    status: mysqlEnum("status", ["draft", "review", "published", "archived"])
      .default("draft")
      .notNull(),
    changeNote: text("changeNote"),
    authorOpenId: varchar("authorOpenId", { length: 64 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({ versionUnique: uniqueIndex("ontology_version_unique").on(table.version) }),
);

export const objectTypes = mysqlTable(
  "objectTypes",
  {
    id: int("id").autoincrement().primaryKey(),
    typeKey: varchar("typeKey", { length: 64 }).notNull(),
    displayName: varchar("displayName", { length: 128 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 48 }),
    versionId: int("versionId"),
    propertySchema: json("propertySchema").$type<Record<string, unknown>>(),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({ typeKeyUnique: uniqueIndex("object_type_key_unique").on(table.typeKey) }),
);

export const enterpriseObjects = mysqlTable(
  "enterpriseObjects",
  {
    id: int("id").autoincrement().primaryKey(),
    objectId: varchar("objectId", { length: 96 }).notNull(),
    typeKey: varchar("typeKey", { length: 64 }).notNull(),
    displayName: varchar("displayName", { length: 200 }).notNull(),
    status: varchar("status", { length: 64 }).notNull(),
    sourceOfTruth: varchar("sourceOfTruth", { length: 64 }).notNull(),
    objectVersion: int("objectVersion").default(1).notNull(),
    properties: json("properties").$type<Record<string, unknown>>(),
    lastObservedAt: timestamp("lastObservedAt").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({ objectIdUnique: uniqueIndex("enterprise_object_id_unique").on(table.objectId) }),
);

export const objectRelations = mysqlTable("objectRelations", {
  id: int("id").autoincrement().primaryKey(),
  relationKey: varchar("relationKey", { length: 96 }).notNull(),
  fromObjectId: varchar("fromObjectId", { length: 96 }).notNull(),
  toObjectId: varchar("toObjectId", { length: 96 }).notNull(),
  relationType: varchar("relationType", { length: 96 }).notNull(),
  evidenceSource: varchar("evidenceSource", { length: 200 }).notNull(),
  confidence: int("confidence").default(100).notNull(),
  observedAt: timestamp("observedAt").defaultNow().notNull(),
});

export const connectors = mysqlTable(
  "connectors",
  {
    id: int("id").autoincrement().primaryKey(),
    connectorKey: varchar("connectorKey", { length: 64 }).notNull(),
    displayName: varchar("displayName", { length: 128 }).notNull(),
    systemType: varchar("systemType", { length: 64 }).notNull(),
    status: mysqlEnum("status", ["online", "degraded", "offline"])
      .default("offline")
      .notNull(),
    authMode: varchar("authMode", { length: 64 }).notNull(),
    endpointRef: varchar("endpointRef", { length: 255 }),
    latencyMs: int("latencyMs"),
    availabilityBps: int("availabilityBps"),
    lastHeartbeatAt: timestamp("lastHeartbeatAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({ connectorKeyUnique: uniqueIndex("connector_key_unique").on(table.connectorKey) }),
);

export const capabilities = mysqlTable(
  "capabilities",
  {
    id: int("id").autoincrement().primaryKey(),
    capabilityKey: varchar("capabilityKey", { length: 96 }).notNull(),
    connectorKey: varchar("connectorKey", { length: 64 }).notNull(),
    kind: mysqlEnum("kind", ["Query", "Function", "Proposal", "Action", "Event"]).notNull(),
    displayName: varchar("displayName", { length: 160 }).notNull(),
    description: text("description"),
    riskLevel: mysqlEnum("riskLevel", ["low", "medium", "high"])
      .default("low")
      .notNull(),
    inputSchema: json("inputSchema").$type<Record<string, unknown>>(),
    outputSchema: json("outputSchema").$type<Record<string, unknown>>(),
    requiresApproval: boolean("requiresApproval").default(false).notNull(),
    enabled: boolean("enabled").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({ capabilityKeyUnique: uniqueIndex("capability_key_unique").on(table.capabilityKey) }),
);

export const identityMappings = mysqlTable(
  "identityMappings",
  {
    id: int("id").autoincrement().primaryKey(),
    mappingKey: varchar("mappingKey", { length: 96 }).notNull(),
    enterpriseObjectId: varchar("enterpriseObjectId", { length: 96 }).notNull(),
    sourceSystem: varchar("sourceSystem", { length: 64 }).notNull(),
    sourceField: varchar("sourceField", { length: 96 }).notNull(),
    sourceValue: varchar("sourceValue", { length: 160 }).notNull(),
    confidence: int("confidence").default(100).notNull(),
    status: mysqlEnum("status", ["verified", "review", "conflict"])
      .default("review")
      .notNull(),
    verifiedBy: varchar("verifiedBy", { length: 96 }),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({ mappingKeyUnique: uniqueIndex("identity_mapping_key_unique").on(table.mappingKey) }),
);

export const actionProposals = mysqlTable(
  "actionProposals",
  {
    id: int("id").autoincrement().primaryKey(),
    proposalId: varchar("proposalId", { length: 96 }).notNull(),
    objectId: varchar("objectId", { length: 96 }).notNull(),
    capabilityKey: varchar("capabilityKey", { length: 96 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    status: mysqlEnum("status", [
      "draft",
      "simulated",
      "pending_approval",
      "approved",
      "rejected",
      "executed",
      "rolled_back",
    ])
      .default("draft")
      .notNull(),
    requestedByOpenId: varchar("requestedByOpenId", { length: 64 }).notNull(),
    idempotencyKey: varchar("idempotencyKey", { length: 128 }).notNull(),
    expectedObjectVersion: int("expectedObjectVersion").notNull(),
    parameters: json("parameters").$type<Record<string, unknown>>(),
    simulationSummary: text("simulationSummary"),
    rollbackPlan: text("rollbackPlan"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    proposalIdUnique: uniqueIndex("action_proposal_id_unique").on(table.proposalId),
    idempotencyKeyUnique: uniqueIndex("action_idempotency_key_unique").on(table.idempotencyKey),
  }),
);

export const approvals = mysqlTable("approvals", {
  id: int("id").autoincrement().primaryKey(),
  proposalId: varchar("proposalId", { length: 96 }).notNull(),
  approverOpenId: varchar("approverOpenId", { length: 64 }).notNull(),
  approverRole: varchar("approverRole", { length: 64 }).notNull(),
  decision: mysqlEnum("decision", ["pending", "approved", "rejected"])
    .default("pending")
    .notNull(),
  comment: text("comment"),
  decidedAt: timestamp("decidedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const governancePolicies = mysqlTable("governancePolicies", {
  id: int("id").autoincrement().primaryKey(),
  policyKey: varchar("policyKey", { length: 96 }).notNull(),
  displayName: varchar("displayName", { length: 160 }).notNull(),
  roleName: varchar("roleName", { length: 64 }).notNull(),
  resourcePattern: varchar("resourcePattern", { length: 200 }).notNull(),
  permission: mysqlEnum("permission", ["read", "propose", "approve", "execute"]).notNull(),
  effect: mysqlEnum("effect", ["allow", "deny"]).default("deny").notNull(),
  conditions: json("conditions").$type<Record<string, unknown>>(),
  enabled: boolean("enabled").default(true).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const auditEvents = mysqlTable("auditEvents", {
  id: int("id").autoincrement().primaryKey(),
  eventId: varchar("eventId", { length: 96 }).notNull(),
  correlationId: varchar("correlationId", { length: 96 }).notNull(),
  actorType: mysqlEnum("actorType", ["user", "agent", "system"]).notNull(),
  actorId: varchar("actorId", { length: 128 }).notNull(),
  eventType: varchar("eventType", { length: 128 }).notNull(),
  objectId: varchar("objectId", { length: 96 }),
  summary: varchar("summary", { length: 255 }).notNull(),
  payload: json("payload").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
