import { GrafanaDatasourceConfigProps } from "./components/NoCodeConfig";

const getTypeFromConfig = (config: GrafanaDatasourceConfigProps): string => {
  return config.properties
    .filter((c) => c.outsideJSON !== true && c.secure !== true)
    .map((c) => {
      return `${c.key}${c.showIf && c.showIf.length > 0 ? "?" : ""}: ${
        c.options && c.options.filter((o) => o.value).length > 0
          ? c.options.map((o) => `"${o.value}"`).join(" | ")
          : c.type
      };`;
    }).join(`
    `);
};

export const getConfigEditorCodeFromConfig = (
  config: GrafanaDatasourceConfigProps
): string => {
  return `// ConfigEditor.tsx

import React from 'react'
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import {
NoCodeConfigComponent,
GrafanaDatasourceConfigProps,
} from "grafana-utils";

type NoCodeJsonPluginOptions = {
    ${getTypeFromConfig(config)}
};

type ConfigEditorProps = DataSourcePluginOptionsEditorProps<NoCodeJsonPluginOptions>;

export const ConfigEditor = (props: ConfigEditorProps) => {
return <NoCodeConfigComponent {...props} editorProps={${JSON.stringify(
    config,
    null,
    4
  )}}/>
}
`;
};
