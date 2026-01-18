-- Workbenches
CREATE TABLE workbench (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true
);

-- Load Carrier Requests
CREATE TABLE load_carrier_request (
    id BIGSERIAL PRIMARY KEY,

    workbench_id BIGINT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    comment TEXT,
    priority TEXT NOT NULL,

    status TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL,
    delivered_at TIMESTAMP,

    CONSTRAINT fk_request_workbench
        FOREIGN KEY (workbench_id)
        REFERENCES workbench (id)
);