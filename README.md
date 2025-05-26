# Demisto Slack Slash Command Config Generator

A web-based tool that simplifies the creation of JSON configurations for XSOAR (Cortex XSOAR) Slack integration slash commands.

## 🌐 Live Demo

**[Try it now →](https://demisto-slash-command-config-generator.vercel.app)**

## 📋 Overview

This tool helps security teams and XSOAR administrators quickly generate the proper JSON configuration needed for Slack slash command integrations. Instead of manually writing complex JSON structures, you can use this intuitive interface to create configurations that will be directly used in your XSOAR Slack integration.

## ✨ Features

- **User-friendly interface** - No need to manually write JSON
- **Real-time preview** - See your configuration as you build it
- **Validation** - Ensures your configuration follows the correct structure
- **Export ready** - Generated JSON is ready to use in XSOAR
- **Sub-command support** - Handle complex command hierarchies
- **Access control** - Configure whitelist and blacklist for commands

## 🚀 How to Use

1. Visit the [live demo](https://demisto-slash-command-config-generator.vercel.app)
2. Fill in your command details:
   - Command name
   - Incident type and name
   - Configure sub-commands if needed
   - Set up user access controls (whitelist/blacklist)
3. Copy the generated JSON configuration
4. Use it directly in your XSOAR Slack integration

## 📝 Generated JSON Structure

The tool generates a JSON configuration with the following structure:

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

### Configuration Fields

| Field | Description |
|-------|-------------|
| `command` | The main slash command name |
| `sub_command` | Whether this command has sub-commands |
| `sub_command_list` | Array of sub-command configurations |
| `incident_type` | Type of incident to create in XSOAR |
| `incident_name` | Name template for created incidents |
| `add_command_details_to_incident_name` | Include command parameters in incident name |
| `whitelist` | Email addresses allowed to use this command |
| `blacklist` | Email addresses blocked from using this command |

## 🔧 Integration with XSOAR

1. Copy the generated JSON from the tool
2. In XSOAR, go to your Slack integration configuration
3. Paste the JSON into the slash command configuration field
4. Save and test your integration

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

**Made for the XSOAR community** 🛡️
