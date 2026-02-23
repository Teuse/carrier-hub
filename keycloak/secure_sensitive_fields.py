"""
Replaces sensitive fields (e.g. secrets) in the realm-export.json with environment variables.
Run this after every export of Keycloak's realm-export.json. 
Inspect PROVIDER_MAPPINGS to see which fields are mapped.
"""

import os
import json
from pathlib import Path

INPUT_FILE = Path(os.getcwd()) / "keycloak" / "realm-export.json"
OUTPUT_FILE = INPUT_FILE

PROVIDER_MAPPINGS = {
    "microsoft": {
        "clientId": "${AZURE_KC_CLIENT_ID}",
        "tenantId": "${AZURE_TENANT_ID}",
        "clientSecret": "${AZURE_KC_CLIENT_SECRET}",
    },
}

with open(INPUT_FILE, "r") as f:
    realm = json.load(f)

providers = realm.get("identityProviders", [])
if not providers:
    print("No identityProviders found in realm export.")
    exit(1)

for provider in providers:
    provider_id = provider.get("providerId")
    if provider_id not in PROVIDER_MAPPINGS:
        print(f"No mapping defined for providerId '{provider_id}', skipping.")
        continue

    config = provider.get("config", {})
    for field, placeholder in PROVIDER_MAPPINGS[provider_id].items():
        if field in config:
            config[field] = placeholder
        else:
            print(f"Warning: field '{field}' not found in config for provider '{provider_id}', skipping.")

with open(OUTPUT_FILE, "w") as f:
    json.dump(realm, f, indent=2)

print(f"Edited {OUTPUT_FILE}")