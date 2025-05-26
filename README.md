# Demisto Slack Slash Command Config Generator
This tool helps you create the JSON configuration that will be used in XSOAR integration for Slack slash commands.

## JSON Structure

The application generates a JSON output with the following structure:

```json
[
  {
    "command": "hunt",
    "sub_command": true,
    "sub_command_list": [
      {
        "sub_command_name": "user",
        "incident_type": "User Hunting",
        "incident_name": "The user hunt started",
        "add_command_details_to_incident_name": true,
        "whitelist": ["user1@example.com"],
        "blacklist": ["user2@example.com"]
      }
    ],
    "incident_type": "General Hunting",
    "incident_name": "Hunting started",
    "add_command_details_to_incident_name": true,
    "whitelist": [],
    "blacklist": []
  }
]
```
