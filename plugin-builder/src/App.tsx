import { useState } from "react";
import { cloneDeep, set } from "lodash";
import {
  InlineFormLabel,
  Input,
  Button,
  Select,
  InlineSwitch,
  RadioButtonGroup,
} from "@grafana/ui";
import {
  NoCodeConfigComponent,
  GrafanaDatasourceConfigProps,
} from "grafana-utils";

function App() {
  const [config, setConfig] = useState<GrafanaDatasourceConfigProps>({
    general: {
      useCollapse: true,
    },
    defaultHTTPSettings: {
      enabled: false,
      defaultURL: "",
    },
    properties: [
      { key: "apiKey", type: "string", label: "API Key" },
      { key: "region", type: "string", label: "Region" },
    ],
  });
  const [previewMode, setPreviewMode] = useState("json");
  const [activePropertyIndex, setActivePropertyIndex] = useState(0);
  const addConfigItem = () => {
    setConfig({
      ...config,
      properties: [
        ...config.properties,
        { key: "apiKey", type: "string", label: "API Key" },
      ],
    });
  };
  const removeConfigItem = (index: number) => {
    setConfig({
      ...config,
      properties: config.properties.filter((f, i) => i !== index),
    });
  };
  const changeProperty = (key: string, value: string | number | boolean) => {
    const newConfig = cloneDeep(config);
    set(newConfig, key, value);
    setConfig(newConfig);
  };
  return (
    <div className="container-fluid">
      <br />
      <div className="row">
        <div className="col-sm-12">
          <h1 className="display-1 p-4">
            Grafana datasource plugin config builder
          </h1>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-4">
          <h4>Configuration Items</h4>
          {config.properties.map((c, index) => (
            <div className="gf-form" key={JSON.stringify(c)}>
              <InlineFormLabel width={3}>Key</InlineFormLabel>
              <div style={{ marginInlineEnd: "5px" }}>
                <Input
                  css={{}}
                  value={config.properties[index].key}
                  width={20}
                  onClick={() => setActivePropertyIndex(index)}
                  onChange={(e) => {
                    setActivePropertyIndex(index);
                    changeProperty(
                      `properties[${index}].key`,
                      e.currentTarget.value
                    );
                  }}
                />
              </div>
              <div style={{ marginInlineEnd: "5px" }}>
                <Select
                  onChange={(e) => {
                    setActivePropertyIndex(index);
                    changeProperty(`properties[${index}].type`, e.value + "");
                  }}
                  options={[
                    { value: "string", label: "String" },
                    { value: "number", label: "Number" },
                    { value: "boolean", label: "Boolean" },
                  ]}
                  value={config.properties[index].type}
                  width={12}
                />
              </div>
              <div style={{ marginInlineEnd: "5px" }}>
                <Input
                  css={{}}
                  value={config.properties[index].group || ""}
                  onClick={() => setActivePropertyIndex(index)}
                  placeholder="Group (optional)"
                  width={15}
                  onChange={(e) => {
                    setActivePropertyIndex(index);
                    changeProperty(
                      `properties[${index}].group`,
                      e.currentTarget.value
                    );
                  }}
                />
              </div>
              <div style={{ marginTop: "5px", marginInlineEnd: "5px" }}>
                <Button
                  size="sm"
                  variant={
                    index === activePropertyIndex ? "primary" : "secondary"
                  }
                  onClick={() => setActivePropertyIndex(index)}
                >
                  Edit
                </Button>
              </div>
              <div style={{ marginTop: "5px", marginInlineEnd: "5px" }}>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => removeConfigItem(index)}
                >
                  x
                </Button>
              </div>
            </div>
          ))}
          <div
            className="text-center"
            style={{ marginBlockStart: "15px", marginBlockEnd: "20px" }}
          >
            <Button variant="primary" size="sm" onClick={addConfigItem}>
              Add Config Item
            </Button>
          </div>
          <br />
          <h4>General options</h4>
          <div className="gf-form">
            <InlineFormLabel width={12}>
              Include Default HTTP Settings
            </InlineFormLabel>
            <InlineSwitch
              css={{}}
              value={config.defaultHTTPSettings?.enabled}
              onChange={(e) =>
                changeProperty(
                  `defaultHTTPSettings.enabled`,
                  e.currentTarget.checked
                )
              }
            />
          </div>
          <div className="gf-form">
            <InlineFormLabel width={12}>
              Use Collapse for groups
            </InlineFormLabel>
            <InlineSwitch
              css={{}}
              value={config.general?.useCollapse}
              onChange={(e) =>
                changeProperty(`general.useCollapse`, e.currentTarget.checked)
              }
            />
          </div>
        </div>
        <div className="col-sm-4">
          {config.properties[activePropertyIndex] ? (
            <>
              <h4>{config.properties[activePropertyIndex].key} Properties</h4>
              <div className="gf-form">
                <InlineFormLabel>Key</InlineFormLabel>
                <Input
                  css={{}}
                  disabled
                  value={config.properties[activePropertyIndex].key}
                />
              </div>
              <div className="gf-form">
                <InlineFormLabel>Label</InlineFormLabel>
                <Input
                  css={{}}
                  value={config.properties[activePropertyIndex].label}
                  onChange={(e) =>
                    changeProperty(
                      `properties[${activePropertyIndex}].label`,
                      e.currentTarget.value
                    )
                  }
                />
              </div>
              <div className="gf-form">
                <InlineFormLabel>Placeholder</InlineFormLabel>
                <Input
                  css={{}}
                  value={config.properties[activePropertyIndex].placeholder}
                  onChange={(e) =>
                    changeProperty(
                      `properties[${activePropertyIndex}].placeholder`,
                      e.currentTarget.value
                    )
                  }
                />
              </div>
              <div className="gf-form">
                <InlineFormLabel>Tooltip</InlineFormLabel>
                <Input
                  css={{}}
                  value={config.properties[activePropertyIndex].tooltip}
                  onChange={(e) =>
                    changeProperty(
                      `properties[${activePropertyIndex}].tooltip`,
                      e.currentTarget.value
                    )
                  }
                />
              </div>
              <div className="gf-form">
                <InlineFormLabel>Is Secure</InlineFormLabel>
                <InlineSwitch
                  css={{}}
                  value={config.properties[activePropertyIndex].secure}
                  onChange={(e) =>
                    changeProperty(
                      `properties[${activePropertyIndex}].secure`,
                      e.currentTarget.checked
                    )
                  }
                />
              </div>
              <div className="gf-form">
                <InlineFormLabel>Options</InlineFormLabel>
                <InlineSwitch css={{}} />
              </div>
              <div className="gf-form">
                <InlineFormLabel>Conditional Rendering?</InlineFormLabel>
                <InlineSwitch css={{}} />
              </div>
            </>
          ) : (
            <>No props</>
          )}
        </div>
        <div className="col-sm-4">
          <h4>Preview</h4>
          <RadioButtonGroup
            options={[
              { value: "json", label: "JSON Preview" },
              { value: "code", label: "Config Editor Code" },
              // { value: "component", label: "Component Preview" },
            ]}
            value={previewMode}
            onChange={(e) => setPreviewMode(e)}
          />
          <div style={{ marginBlock: "10px" }}>
            {previewMode === "json" && (
              <pre>{JSON.stringify(config, null, 4)}</pre>
            )}
            {previewMode === "component" && (
              <>
                <NoCodeConfigComponent
                  options={{
                    id: 1,
                    orgId: 1,
                    name: "",
                    type: "",
                    typeLogoUrl: "",
                    access: "",
                    url: "",
                    password: "",
                    user: "",
                    database: "",
                    basicAuth: false,
                    basicAuthPassword: "",
                    basicAuthUser: "",
                    isDefault: false,
                    withCredentials: false,
                    jsonData: {},
                    secureJsonFields: {},
                    readOnly: false,
                  }}
                  onOptionsChange={() => {}}
                  editorProps={config}
                />
              </>
            )}
            {previewMode === "code" && (
              <pre>
                {`import React from 'react'
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import {
  NoCodeConfigComponent,
  GrafanaDatasourceConfigProps,
} from "grafana-utils";

type NoCodeJsonPluginOptions = {};
type ConfigEditorProps = DataSourcePluginOptionsEditorProps<NoCodeJsonPluginOptions>;

export const ConfigEditor = (props: ConfigEditorProps) => {
  return <NoCodeConfigComponent {...props} editorProps={${JSON.stringify(
    config,
    null,
    4
  )}}/>
}
                `}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
