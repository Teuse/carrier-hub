-- Workbenches
CREATE TABLE workbench (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true
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

    workbench_id BIGINT NOT NULL,
    load_carrier_id BIGINT NOT NULL,
    comment TEXT,
    priority TEXT NOT NULL,

    status TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    delivered_at TIMESTAMP,

    CONSTRAINT fk_request_workbench
        FOREIGN KEY (workbench_id)
        REFERENCES workbench (id),

    CONSTRAINT fk_request_load_carrier
        FOREIGN KEY (load_carrier_id)
        REFERENCES load_carrier (id)
);

-- Indexes (recommended)
--CREATE INDEX idx_request_workbench_id ON load_carrier_request(workbench_id);
--CREATE INDEX idx_request_status ON load_carrier_request(status);