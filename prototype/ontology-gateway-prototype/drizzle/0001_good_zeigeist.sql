CREATE TABLE `actionProposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposalId` varchar(96) NOT NULL,
	`objectId` varchar(96) NOT NULL,
	`capabilityKey` varchar(96) NOT NULL,
	`title` varchar(200) NOT NULL,
	`status` enum('draft','simulated','pending_approval','approved','rejected','executed','rolled_back') NOT NULL DEFAULT 'draft',
	`requestedByOpenId` varchar(64) NOT NULL,
	`idempotencyKey` varchar(128) NOT NULL,
	`expectedObjectVersion` int NOT NULL,
	`parameters` json,
	`simulationSummary` text,
	`rollbackPlan` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `actionProposals_id` PRIMARY KEY(`id`),
	CONSTRAINT `action_proposal_id_unique` UNIQUE(`proposalId`)
);
--> statement-breakpoint
CREATE TABLE `approvals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposalId` varchar(96) NOT NULL,
	`approverOpenId` varchar(64) NOT NULL,
	`approverRole` varchar(64) NOT NULL,
	`decision` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`comment` text,
	`decidedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `approvals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auditEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` varchar(96) NOT NULL,
	`correlationId` varchar(96) NOT NULL,
	`actorType` enum('user','agent','system') NOT NULL,
	`actorId` varchar(128) NOT NULL,
	`eventType` varchar(128) NOT NULL,
	`objectId` varchar(96),
	`summary` varchar(255) NOT NULL,
	`payload` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `capabilities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`capabilityKey` varchar(96) NOT NULL,
	`connectorKey` varchar(64) NOT NULL,
	`kind` enum('Query','Function','Proposal','Action','Event') NOT NULL,
	`displayName` varchar(160) NOT NULL,
	`description` text,
	`riskLevel` enum('low','medium','high') NOT NULL DEFAULT 'low',
	`inputSchema` json,
	`outputSchema` json,
	`requiresApproval` boolean NOT NULL DEFAULT false,
	`enabled` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `capabilities_id` PRIMARY KEY(`id`),
	CONSTRAINT `capability_key_unique` UNIQUE(`capabilityKey`)
);
--> statement-breakpoint
CREATE TABLE `connectors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`connectorKey` varchar(64) NOT NULL,
	`displayName` varchar(128) NOT NULL,
	`systemType` varchar(64) NOT NULL,
	`status` enum('online','degraded','offline') NOT NULL DEFAULT 'offline',
	`authMode` varchar(64) NOT NULL,
	`endpointRef` varchar(255),
	`latencyMs` int,
	`availabilityBps` int,
	`lastHeartbeatAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `connectors_id` PRIMARY KEY(`id`),
	CONSTRAINT `connector_key_unique` UNIQUE(`connectorKey`)
);
--> statement-breakpoint
CREATE TABLE `enterpriseObjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`objectId` varchar(96) NOT NULL,
	`typeKey` varchar(64) NOT NULL,
	`displayName` varchar(200) NOT NULL,
	`status` varchar(64) NOT NULL,
	`sourceOfTruth` varchar(64) NOT NULL,
	`objectVersion` int NOT NULL DEFAULT 1,
	`properties` json,
	`lastObservedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `enterpriseObjects_id` PRIMARY KEY(`id`),
	CONSTRAINT `enterprise_object_id_unique` UNIQUE(`objectId`)
);
--> statement-breakpoint
CREATE TABLE `governancePolicies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`policyKey` varchar(96) NOT NULL,
	`displayName` varchar(160) NOT NULL,
	`roleName` varchar(64) NOT NULL,
	`resourcePattern` varchar(200) NOT NULL,
	`permission` enum('read','propose','approve','execute') NOT NULL,
	`effect` enum('allow','deny') NOT NULL DEFAULT 'deny',
	`conditions` json,
	`enabled` boolean NOT NULL DEFAULT true,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `governancePolicies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `identityMappings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mappingKey` varchar(96) NOT NULL,
	`enterpriseObjectId` varchar(96) NOT NULL,
	`sourceSystem` varchar(64) NOT NULL,
	`sourceField` varchar(96) NOT NULL,
	`sourceValue` varchar(160) NOT NULL,
	`confidence` int NOT NULL DEFAULT 100,
	`status` enum('verified','review','conflict') NOT NULL DEFAULT 'review',
	`verifiedBy` varchar(96),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `identityMappings_id` PRIMARY KEY(`id`),
	CONSTRAINT `identity_mapping_key_unique` UNIQUE(`mappingKey`)
);
--> statement-breakpoint
CREATE TABLE `objectRelations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`relationKey` varchar(96) NOT NULL,
	`fromObjectId` varchar(96) NOT NULL,
	`toObjectId` varchar(96) NOT NULL,
	`relationType` varchar(96) NOT NULL,
	`evidenceSource` varchar(200) NOT NULL,
	`confidence` int NOT NULL DEFAULT 100,
	`observedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `objectRelations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `objectTypes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`typeKey` varchar(64) NOT NULL,
	`displayName` varchar(128) NOT NULL,
	`description` text,
	`icon` varchar(48),
	`versionId` int,
	`propertySchema` json,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `objectTypes_id` PRIMARY KEY(`id`),
	CONSTRAINT `object_type_key_unique` UNIQUE(`typeKey`)
);
--> statement-breakpoint
CREATE TABLE `ontologyVersions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`version` varchar(32) NOT NULL,
	`status` enum('draft','review','published','archived') NOT NULL DEFAULT 'draft',
	`changeNote` text,
	`authorOpenId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ontologyVersions_id` PRIMARY KEY(`id`),
	CONSTRAINT `ontology_version_unique` UNIQUE(`version`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `enterpriseRole` enum('business_employee','supervisor','ontology_builder','developer_governance') DEFAULT 'business_employee' NOT NULL;