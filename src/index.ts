import { Client } from "@notionhq/client";
import * as fs from "fs";
import config from "../config";

console.log(`config`, config);

// Initialize a new Notion client with the API key
const notion = new Client({
  auth: config.notionApiKey,
});

console.log(`notion client`, notion);

// Function to fetch a Notion database by ID and return its properties
async function getDatabaseProperties(databaseId: string): Promise<any> {
  console.log(`getting database properties for ${databaseId}`);
  try {
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });
    console.log(`response`, response);

    return response.properties as any;
  } catch (error) {
    console.error(
      `Error retrieving properties for database ${databaseId}:`,
      error
    );

    console.error(error);
  }
}

// Function to generate the types for a Notion database
async function generateDatabaseTypes(): Promise<void> {
  const properties = await getDatabaseProperties(config.databaseId);

  // Map Notion properties to Typescript types
  const typeMappings = Object.entries(properties).reduce(
    (acc, [name, property]) => {
      let type: string;
      let propertyAny = property as any;
      switch (propertyAny.type) {
        case "title":
          type = "string";
          break;
        case "rich_text":
          type = "string";
          break;
        case "number":
          type = "number";
          break;
        case "select":
          type = `{ name: '${propertyAny.name}'; color: '${propertyAny.select.options[0].color}'; }`;
          break;
        case "multi_select":
          type = `{ name: '${
            propertyAny.name
          }'; colors: '${propertyAny.multi_select.options.map(
            (option: any) => option.color
          )}'; }[]`;
          break;
        case "date":
          type = "string";
          break;
        case "checkbox":
          type = "boolean";
          break;
        case "url":
          type = "string";
          break;
        case "email":
          type = "string";
          break;
        case "phone_number":
          type = "string";
          break;
        case "created_time":
          type = "string";
          break;
        case "created_by":
          type = "string";
          break;
        case "last_edited_time":
          type = "string";
          break;
        case "last_edited_by":
          type = "string";
          break;
        case "formula":
          // TODO: Implement formula type mapping
          type = "any";
          break;
        case "relation":
          // TODO: Implement relation type mapping
          type = "any";
          break;
        case "rollup":
          // TODO: Implement rollup type mapping
          type = "any";
          break;
        case "people":
          // TODO: Implement people type mapping
          type = "any";
          break;
        case "files":
          // TODO: Implement files type mapping
          type = "any";
          break;
        default:
          type = "any";
          break;
      }

      acc.push(`  ${name}: ${type};`);

      return acc;
    },
    [] as string[]
  );

  // Generate the Typescript file
  const fileContent = `type ${config.databaseName}Type = {\n${typeMappings.join(
    "\n"
  )}\n};\n`;

  // Write the Typescript file to disk
  fs.writeFileSync(`${config.databaseName}Type.ts`, fileContent);

  // Log the generated Typescript file
  console.log(fileContent);
}

// Example usage
generateDatabaseTypes();
