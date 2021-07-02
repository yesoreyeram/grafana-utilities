import React, { useState } from "react";
import { get, set, cloneDeep, uniq, every } from "lodash";
import {
  DataSourcePluginOptionsEditorProps,
  SelectableValue,
} from "@grafana/data";
import {
  DataSourceHttpSettings,
  Collapse,
  InlineFormLabel,
  Input,
  TextArea,
  Button,
  Select,
  RadioButtonGroup,
  Switch,
  useTheme,
} from "@grafana/ui";

type NoCodeJsonOptions = {};

type propType = "string" | "number" | "boolean" | "component";
type EditorPropertyCondition = {
  key: string;
  operand: "===" | "!==" | "in" | "notin";
  value: string | number | boolean | string[] | number[];
  outsideJSON?: boolean;
};
type EditorProperty = {
  key: string;
  type: propType;
  label?: string;
  tooltip?: string;
  placeholder?: string;
  outsideJSON?: boolean;
  options?: Array<SelectableValue<string | number>>;
  useRadio?: boolean;
  multiLine?: boolean;
  showIf?: EditorPropertyCondition[];
  group?: string;
  component?: any;
  class?: string;
  secure?: boolean;
};
export type GrafanaDatasourceConfigProps = {
  general?: {
    useCollapse?: boolean;
  };
  defaultHTTPSettings?: {
    enabled: boolean;
    defaultURL: string;
  };
  properties: EditorProperty[];
};

const GroupWrapper: React.FC<{ name?: string; useCollapse?: boolean }> = ({
  name,
  children,
  useCollapse,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return name ? (
    <>
      {useCollapse ? (
        <Collapse
          label={name}
          collapsible={true}
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
        >
          {children}
        </Collapse>
      ) : (
        <>
          <h3 className="page-heading">{name}</h3>
          {children}
          <br />
        </>
      )}
    </>
  ) : (
    <>
      {children}
      <br />
    </>
  );
};
export type NoCodeConfigComponentProps =
  DataSourcePluginOptionsEditorProps<NoCodeJsonOptions> & {
    editorProps: GrafanaDatasourceConfigProps;
  };

export const NoCodeConfigComponent = (props: NoCodeConfigComponentProps) => {
  const theme = useTheme();
  const { options, onOptionsChange, editorProps } = props;

  const PREFIX_JSON_DATA = "jsonData";
  const PREFIX_SECURE_JSON_DATA = "secureJsonData";
  const PREFIX_SECURE_JSON_FIELDS = "secureJsonFields";

  const getValueFromOptions = (key: string, outsideJSON?: boolean) => {
    return get(options, `${outsideJSON ? "" : PREFIX_JSON_DATA + "."}${key}`);
  };

  const onJSONOptionsChange = (
    key: string,
    value: any,
    type: propType,
    outsideJSON?: boolean
  ) => {
    const newOptions = cloneDeep(options);
    set(
      newOptions,
      `${outsideJSON ? "" : PREFIX_JSON_DATA + "."}${key}`,
      type === "number" ? +value : value
    );
    onOptionsChange(newOptions);
  };

  const getSecureValueFromOptions = (key: string): string => {
    return get(options, `${PREFIX_SECURE_JSON_DATA}.${key}`) || "";
  };

  const isSecureFieldConfigured = (key: string) => {
    return (
      get(options, `${PREFIX_SECURE_JSON_FIELDS}.${key}`) &&
      !get(options, `${PREFIX_SECURE_JSON_DATA}.${key}`)
    );
  };

  const resetSecureKey = (key: string) => {
    const newOptions = cloneDeep(options);
    set(newOptions, `${PREFIX_SECURE_JSON_FIELDS}.${key}`, false);
    set(newOptions, `${PREFIX_SECURE_JSON_DATA}.${key}`, "");
    onOptionsChange(newOptions);
  };

  const onSecureJSONOptionsChange = (key: string, value: string) => {
    const newOptions = cloneDeep(options);
    set(newOptions, `${PREFIX_SECURE_JSON_FIELDS}.${key}`, true);
    set(newOptions, `${PREFIX_SECURE_JSON_DATA}.${key}`, value);
    onOptionsChange(newOptions);
  };

  const switchContainerStyle: React.CSSProperties = {
    padding: `0 ${theme.spacing.sm}`,
    height: `${theme.spacing.formInputHeight}px`,
    display: "flex",
    alignItems: "center",
  };

  const canRender = (conditions: EditorPropertyCondition[] = []): boolean => {
    let satisfied = conditions.map((condition) => {
      let targetValue = getValueFromOptions(
        condition.key,
        condition.outsideJSON
      );
      switch (condition.operand) {
        case "===":
          return targetValue === condition.value;
        case "!==":
          return targetValue !== condition.value;
        case "in":
          return (
            Array.isArray(condition.value) &&
            [...condition.value].includes(targetValue)
          );
        case "notin":
          return (
            Array.isArray(condition.value) &&
            ![...condition.value].includes(targetValue)
          );
        default:
          return false;
      }
    });
    return every(satisfied);
  };

  const groups: Array<{ name?: string; props: EditorProperty[] }> = [];
  const propsWithoutGroup = (
    editorProps.properties?.filter((p) => !p.group) || []
  ).filter((p) => {
    return p.showIf && p.showIf.length > 0 ? canRender(p.showIf) : true;
  });
  if (propsWithoutGroup.length > 0) {
    groups.push({ name: "", props: propsWithoutGroup });
  }
  uniq(editorProps.properties?.map((p) => p.group))
    .filter(Boolean)
    .forEach((g) => {
      const props = (
        editorProps.properties?.filter((p) => p.group === g) || []
      ).filter((p) => {
        return p.showIf && p.showIf.length > 0 ? canRender(p.showIf) : true;
      });
      if (props.length > 0) {
        groups.push({ name: g, props });
      }
    });

  return (
    <>
      {editorProps.defaultHTTPSettings?.enabled && (
        <DataSourceHttpSettings
          onChange={onOptionsChange}
          dataSourceConfig={options}
          defaultUrl={editorProps.defaultHTTPSettings.defaultURL}
        />
      )}
      {groups
        .filter((g) => g.props.length > 0)
        .map((g) => {
          return (
            <GroupWrapper
              name={g.name}
              key={g.name}
              useCollapse={editorProps.general?.useCollapse}
            >
              {g.props.map((prop: EditorProperty) => {
                return (
                  <div
                    className="gf-form max-width-30"
                    key={JSON.stringify(prop)}
                  >
                    {prop.label && (
                      <InlineFormLabel
                        className="width-10"
                        tooltip={prop.tooltip}
                      >
                        {prop.label || prop.key}
                      </InlineFormLabel>
                    )}
                    {"component" === prop.type &&
                      React.createElement(prop.component, {
                        key: prop.key,
                        className: prop.class,
                        value: !prop.secure
                          ? getValueFromOptions(prop.key, prop.outsideJSON)
                          : getSecureValueFromOptions(prop.key),
                        onChange: (e: any) =>
                          !prop.secure
                            ? onJSONOptionsChange(
                                prop.key,
                                e.value,
                                prop.type,
                                prop.outsideJSON
                              )
                            : onSecureJSONOptionsChange(prop.key, e.value),
                      })}
                    {["string", "number"].includes(prop.type) &&
                      !prop.secure && (
                        <>
                          {prop.options && prop.options.length > 0 ? (
                            <>
                              {prop.useRadio ? (
                                <RadioButtonGroup
                                  options={prop.options}
                                  value={getValueFromOptions(
                                    prop.key,
                                    prop.outsideJSON
                                  )}
                                  onChange={(e) =>
                                    onJSONOptionsChange(
                                      prop.key,
                                      e,
                                      prop.type,
                                      prop.outsideJSON
                                    )
                                  }
                                />
                              ) : (
                                <Select
                                  className="width-20"
                                  onChange={(e) =>
                                    onJSONOptionsChange(
                                      prop.key,
                                      e.value,
                                      prop.type,
                                      prop.outsideJSON
                                    )
                                  }
                                  value={getValueFromOptions(
                                    prop.key,
                                    prop.outsideJSON
                                  )}
                                  options={prop.options}
                                />
                              )}
                            </>
                          ) : prop.multiLine ? (
                            <TextArea
                              css={{}}
                              className="width-20"
                              placeholder={prop.placeholder}
                              value={
                                getValueFromOptions(
                                  prop.key,
                                  prop.outsideJSON
                                ) || (prop.type === "number" ? "0" : "")
                              }
                              onChange={(e) =>
                                onJSONOptionsChange(
                                  prop.key,
                                  e.currentTarget.value,
                                  prop.type,
                                  prop.outsideJSON
                                )
                              }
                              rows={4}
                            />
                          ) : (
                            <Input
                              css={{}}
                              className="width-20"
                              type={prop.type === "number" ? "number" : "text"}
                              placeholder={prop.placeholder}
                              value={
                                getValueFromOptions(
                                  prop.key,
                                  prop.outsideJSON
                                ) || (prop.type === "number" ? "0" : "")
                              }
                              onChange={(e) =>
                                onJSONOptionsChange(
                                  prop.key,
                                  e.currentTarget.value,
                                  prop.type,
                                  prop.outsideJSON
                                )
                              }
                            />
                          )}
                        </>
                      )}
                    {prop.type === "boolean" && (
                      <div style={switchContainerStyle}>
                        <Switch
                          css={{}}
                          value={getValueFromOptions(
                            prop.key,
                            prop.outsideJSON
                          )}
                          onChange={(e) =>
                            onJSONOptionsChange(
                              prop.key,
                              e.currentTarget.checked,
                              prop.type,
                              prop.outsideJSON
                            )
                          }
                        />
                      </div>
                    )}
                    {prop.secure === true && prop.type === "string" && (
                      <>
                        {isSecureFieldConfigured(prop.key) ? (
                          <>
                            <input
                              type="text"
                              className="gf-form-input width-15"
                              disabled={true}
                              value="configured"
                            />
                            <Button
                              onClick={() => resetSecureKey(prop.key)}
                              variant="secondary"
                            >
                              Reset
                            </Button>
                          </>
                        ) : (
                          <>
                            {prop.multiLine ? (
                              <TextArea
                                css={{}}
                                className="min-width-20"
                                type="password"
                                placeholder={prop.placeholder}
                                value={
                                  getSecureValueFromOptions(prop.key) || ""
                                }
                                onChange={(e) =>
                                  onSecureJSONOptionsChange(
                                    prop.key,
                                    e.currentTarget.value
                                  )
                                }
                                rows={4}
                              />
                            ) : (
                              <Input
                                css={{}}
                                className="width-20"
                                type="password"
                                placeholder={prop.placeholder}
                                value={
                                  getSecureValueFromOptions(prop.key) || ""
                                }
                                onChange={(e) =>
                                  onSecureJSONOptionsChange(
                                    prop.key,
                                    e.currentTarget.value
                                  )
                                }
                              />
                            )}
                          </>
                        )}
                      </>
                    )}
                    <br />
                  </div>
                );
              })}
            </GroupWrapper>
          );
        })}
    </>
  );
};
