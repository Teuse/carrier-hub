-- Workspaces
CREATE TABLE workspace (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

CREATE UNIQUE INDEX ux_workspace_name ON workspace(name);

-- Anomalies
CREATE TABLE anomaly (
    id BIGSERIAL PRIMARY KEY,
    van TEXT,
    pn TEXT,
    kz TEXT,
    notes TEXT,
    status TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    created_by TEXT,
    reviewed_by TEXT,

    workspace_id BIGINT NOT NULL,

    sharepoint_item_id TEXT,

    CONSTRAINT fk_anomaly_workspace
        FOREIGN KEY (workspace_id)
        REFERENCES workspace(id)
);

-- Load carrier templates (predefined)
CREATE TABLE load_carrier (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    qr_code TEXT NOT NULL UNIQUE,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    deleted_at TIMESTAMP
);

-- Load Carrier Requests
CREATE TABLE load_carrier_request (
    id BIGSERIAL PRIMARY KEY,

    workspace_id BIGINT NOT NULL,
    load_carrier_id BIGINT NOT NULL,
    comment TEXT,
    priority TEXT NOT NULL,

    status TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    delivered_at TIMESTAMP,

    CONSTRAINT fk_request_workspace
        FOREIGN KEY (workspace_id)
        REFERENCES workspace (id),

    CONSTRAINT fk_request_load_carrier
        FOREIGN KEY (load_carrier_id)
        REFERENCES load_carrier (id)
);

-- GraphAPI Subscription Objects
CREATE TABLE graph_api_sub (
    id TEXT PRIMARY KEY,
    application_id TEXT,
    change_type TEXT,
    client_state TEXT,
    creator_id TEXT,
    encryption_certificate TEXT,
    encryption_certificate_id TEXT,
    expiration_date_time TIMESTAMP,
    include_resource_data BOOLEAN,
    latest_supported_tls_version TEXT,
    lifecycle_notification_url TEXT,
    notification_query_options TEXT,
    notification_url TEXT,
    notification_url_app_id TEXT,
    resource TEXT
);

-- Indexes (recommended)
--CREATE INDEX idx_request_workspace_id ON load_carrier_request(workspace_id);
--CREATE INDEX idx_request_status ON load_carrier_request(status);