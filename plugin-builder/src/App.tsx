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
// import {
//   NoCodeConfigComponent,
//   GrafanaDatasourceConfigProps,
// } from "grafana-utils";

import {
  GrafanaDatasourceConfigProps,
  NoCodeConfigComponent,
} from "./components/NoCodeConfig";
import { getConfigEditorCodeFromConfig } from "./utils";

function App() {
  const [config, setConfig] = useState<GrafanaDatasourceConfigProps>({
    general: {
      useCollapse: true,
    },
    defaultHTTPSettings: {
      enabled: false,
      defaultURL: "",
    },
    properties: [],
  });
  const [previewConfig, setPreviewConfig] = useState({
    uid: "1",
    typeName: "",
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
  });
  const [previewMode, setPreviewMode] = useState("json");
  const [activePropertyIndex, setActivePropertyIndex] = useState(0);
  const addConfigItem = () => {
    setConfig({
      ...config,
      properties: [
        ...config.properties,
        {
          key: `apiKey${config.properties.length + 1}`,
          type: "string",
          label: `API Key ${config.properties.length + 1}`,
        },
      ],
    });
    setActivePropertyIndex(config.properties.length);
  };
  const removeConfigItem = (index: number) => {
    if (index === activePropertyIndex) {
      setActivePropertyIndex(0);
    }
    setConfig({
      ...config,
      properties: config.properties.filter((f, i) => i !== index),
    });
  };
  const changeProperty = (
    key: string,
    value: string | number | boolean | string[] | number[]
  ) => {
    const newConfig = cloneDeep(config);
    set(newConfig, key, value);
    setConfig(newConfig);
  };
  const toggleOptions = (index: number, checked: boolean) => {
    const value = checked ? [{ label: "", value: "" }] : undefined;
    const newConfig = cloneDeep(config);
    set(newConfig, `properties[${index}].options`, value);
    setConfig(newConfig);
  };
  const addOption = (index: number) => {
    const newConfig = cloneDeep(config);
    const options = newConfig.properties[index].options || [];
    options.push({ label: "", value: "" });
    set(newConfig, `properties[${index}].options`, options);
    setConfig(newConfig);
  };
  const removeOption = (index: number, optIndex: number) => {
    const newConfig = cloneDeep(config);
    const options = newConfig.properties[index].options || [];
    const update = options.filter((o, i) => i !== optIndex);
    set(newConfig, `properties[${index}].options`, update);
    setConfig(newConfig);
  };
  const toggleRules = (index: number, checked: boolean) => {
    const value = checked
      ? [{ key: "", value: "", operand: "===" }]
      : undefined;
    const newConfig = cloneDeep(config);
    set(newConfig, `properties[${index}].showIf`, value);
    setConfig(newConfig);
  };
  const addRule = (index: number) => {
    const newConfig = cloneDeep(config);
    const options = newConfig.properties[index].showIf || [];
    options.push({ key: "", value: "", operand: "===" });
    set(newConfig, `properties[${index}].showIf`, options);
    setConfig(newConfig);
  };
  const removeRule = (index: number, optIndex: number) => {
    const newConfig = cloneDeep(config);
    const options = newConfig.properties[index].showIf || [];
    const update = options.filter((o, i) => i !== optIndex);
    set(newConfig, `properties[${index}].showIf`, update);
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
        {/* Configuration list */}
        <div className="xcol-sm-5">
          <h4>Config Keys</h4>
          <div className="gf-form">
            <InlineFormLabel width={10}>Key</InlineFormLabel>
            <InlineFormLabel width={10}>Label</InlineFormLabel>
            <InlineFormLabel width={6}>Type</InlineFormLabel>
            <InlineFormLabel width={8}>Group</InlineFormLabel>
          </div>
          {config.properties.map((c, index) => (
            <div className="gf-form" key={index}>
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
                <Input
                  css={{}}
                  value={config.properties[index].label}
                  width={20}
                  onClick={() => setActivePropertyIndex(index)}
                  onChange={(e) => {
                    setActivePropertyIndex(index);
                    changeProperty(
                      `properties[${index}].label`,
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
                  width={16}
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
              Add Form Control
            </Button>
          </div>
          <br />
          {/* General Options Section */}
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
        {/* Properties Section */}
        <div className="xcol-sm-4">
          {config.properties[activePropertyIndex] ? (
            <>
              <h4>{config.properties[activePropertyIndex].key} Properties</h4>
              <div className="gf-form">
                <InlineFormLabel width={6}>Key</InlineFormLabel>
                <Input
                  css={{}}
                  disabled
                  value={config.properties[activePropertyIndex].key}
                />
              </div>
              <div className="gf-form">
                <InlineFormLabel width={6}>Label</InlineFormLabel>
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
                <InlineFormLabel width={6}>Placeholder</InlineFormLabel>
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
                <InlineFormLabel width={6}>Tooltip</InlineFormLabel>
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
              {config.properties[activePropertyIndex].type === "string" && (
                <div className="gf-form">
                  <InlineFormLabel width={6}>Multiline</InlineFormLabel>
                  <InlineSwitch
                    css={{}}
                    value={config.properties[activePropertyIndex].multiLine}
                    onChange={(e) =>
                      changeProperty(
                        `properties[${activePropertyIndex}].multiLine`,
                        e.currentTarget.checked
                      )
                    }
                  />
                </div>
              )}
              <div className="gf-form">
                <InlineFormLabel width={6}>Is Secure</InlineFormLabel>
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

              {/* OPTIONS */}
              {!config.properties[activePropertyIndex].secure && (
                <div className="gf-form">
                  <InlineFormLabel width={6}>Options</InlineFormLabel>
                  <InlineSwitch
                    css={{}}
                    value={
                      config.properties[activePropertyIndex].options !==
                      undefined
                    }
                    onChange={(e) =>
                      toggleOptions(
                        activePropertyIndex,
                        e.currentTarget.checked
                      )
                    }
                  />
                  <div className="option-header">
                    {config.properties[activePropertyIndex].options !==
                      undefined && (
                      <Button
                        size="sm"
                        onClick={() => addOption(activePropertyIndex)}
                      >
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              )}
              {!config.properties[activePropertyIndex].secure &&
                config.properties[activePropertyIndex].options !== undefined &&
                config.properties[activePropertyIndex].options?.map((o, i) => (
                  <div className="gf-form options">
                    <Input
                      css={{}}
                      value={o.label || ""}
                      placeholder="Label"
                      width={15}
                      onChange={(e) => {
                        setActivePropertyIndex(activePropertyIndex);
                        changeProperty(
                          `properties[${activePropertyIndex}].options[${i}].label`,
                          e.currentTarget.value
                        );
                      }}
                    />
                    <Input
                      css={{}}
                      value={o.value || ""}
                      placeholder="Value"
                      width={15}
                      onChange={(e) => {
                        setActivePropertyIndex(activePropertyIndex);
                        changeProperty(
                          `properties[${activePropertyIndex}].options[${i}].value`,
                          e.currentTarget.value
                        );
                      }}
                    />
                    <Button
                      className="option-remove"
                      size="sm"
                      variant="secondary"
                      onClick={() => removeOption(activePropertyIndex, i)}
                    >
                      x
                    </Button>
                  </div>
                ))}
              {!config.properties[activePropertyIndex].secure &&
              config.properties[activePropertyIndex].options &&
              config.properties[activePropertyIndex].options?.length ? (
                <>
                  <div className="gf-form">
                    <InlineFormLabel width={8}>
                      Use Radio Button
                    </InlineFormLabel>
                    <InlineSwitch
                      css={{}}
                      value={config.properties[activePropertyIndex].useRadio}
                      onChange={(e) =>
                        changeProperty(
                          `properties[${activePropertyIndex}].useRadio`,
                          e.currentTarget.checked
                        )
                      }
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
              {/* SHOW IF */}
              <div className="gf-form">
                <InlineFormLabel width={6}>Rules</InlineFormLabel>
                <InlineSwitch
                  css={{}}
                  value={
                    config.properties[activePropertyIndex].showIf !== undefined
                  }
                  onChange={(e) =>
                    toggleRules(activePropertyIndex, e.currentTarget.checked)
                  }
                />
                <div className="option-header">
                  {config.properties[activePropertyIndex].showIf !==
                    undefined && (
                    <Button
                      size="sm"
                      onClick={() => addRule(activePropertyIndex)}
                    >
                      Add
                    </Button>
                  )}
                </div>
              </div>
              {config.properties[activePropertyIndex].showIf !== undefined &&
                config.properties[activePropertyIndex].showIf?.map((o, i) => (
                  <div className="gf-form options">
                    <Input
                      css={{}}
                      value={o.key || ""}
                      placeholder="Key"
                      width={15}
                      onChange={(e) => {
                        setActivePropertyIndex(activePropertyIndex);
                        changeProperty(
                          `properties[${activePropertyIndex}].showIf[${i}].key`,
                          e.currentTarget.value
                        );
                      }}
                    />
                    <Select
                      onChange={(e) => {
                        setActivePropertyIndex(activePropertyIndex);
                        changeProperty(
                          `properties[${activePropertyIndex}].showIf[${i}].operand`,
                          String(e.value)
                        );
                      }}
                      options={[
                        { value: "===", label: "=" },
                        { value: "!==", label: "!=" },
                        { value: "in", label: "in" },
                        { value: "notin", label: "!in" },
                      ]}
                      value={o.operand}
                      width={4}
                    />
                    <Input
                      css={{}}
                      value={String(o.value)}
                      placeholder="Value"
                      width={15}
                      onChange={(e) => {
                        setActivePropertyIndex(activePropertyIndex);
                        changeProperty(
                          `properties[${activePropertyIndex}].showIf[${i}].value`,
                          e.currentTarget.value === "true"
                            ? true
                            : e.currentTarget.value === "false"
                            ? false
                            : ["in", "notin"].includes(o.operand)
                            ? (e.currentTarget.value + "").split(",")
                            : e.currentTarget.value
                        );
                      }}
                    />
                    <Button
                      className="option-remove"
                      size="sm"
                      variant="secondary"
                      onClick={() => removeRule(activePropertyIndex, i)}
                    >
                      x
                    </Button>
                  </div>
                ))}
            </>
          ) : (
            <>No props</>
          )}
        </div>
        {/* Preview Section */}
        <div className="col-sm-4">
          <h4>Preview</h4>
          <RadioButtonGroup
            options={[
              { value: "json", label: "JSON Preview" },
              { value: "code", label: "Config Editor Code" },
              { value: "component", label: "Component Preview" },
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
                  options={previewConfig}
                  onOptionsChange={setPreviewConfig}
                  editorProps={config}
                />
              </>
            )}
            {previewMode === "code" && (
              <pre>{getConfigEditorCodeFromConfig(config)}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
