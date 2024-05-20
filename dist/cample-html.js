/*!
 * cample-html v0.0.3 (https://github.com/cample-html/cample-html)
 * Copyright (c) 2024 Anton Maklakov
 * Licensed under MIT (https://github.com/cample-html/cample-html/blob/main/LICENSE)
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    //@ts-expect-error define not found
  } else if (typeof define === "function" && define.amd) {
    //@ts-expect-error define not found
    define([], factory);
  } else {
    //@ts-expect-error root.CampleHTML not found
    root.CampleHTML = root.CampleHTML || factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  return (function () {
    "use strict";
    const checkObject = (val) => {
      return typeof val === "object" && !Array.isArray(val) && val !== null;
    };
    const createError = (text) => {
      throw new Error(text);
    };
    const getIsMethodValid = (method) => {
      return (
        method !== "get" &&
        method !== "post" &&
        method !== "put" &&
        method !== "delete" &&
        method !== "patch"
      );
    };
    const NODE_ATTR = "TEMPLATE";
    const DATA_STATIC = "data-";
    const CAMPLE_ATTRIBUTE = `${DATA_STATIC}cample`;
    const SOURCE_ATTR = `${DATA_STATIC}src`;
    const METHOD_ATTR = `${DATA_STATIC}method`;
    const STATUS_ATTR = `${DATA_STATIC}status`;
    const AFTER_ATTR = `${DATA_STATIC}after`;
    const MODE_ATTR = `${DATA_STATIC}mode`;

    const doc = () => document;
    const getResponseElements = (response) => {
      if (typeof response !== "string") createError("Bad response");
      const elementDocument = new DOMParser().parseFromString(
        `<template>${response}</template>`,
        "text/html"
      );
      const elWrapper = elementDocument.childNodes[0].childNodes[0].firstChild;
      const elContent = elWrapper.content;
      const scripts = elContent.querySelectorAll("script");
      for (let i = 0; i < scripts.length; i++) {
        const currentScript = scripts[i];
        elContent.removeChild(currentScript);
      }
      return elWrapper;
    };
    const makeXMLHttpRequest = (
      el,
      dataObj,
      method,
      source,
      withCredentials,
      timeout,
      headers,
      requestBody,
      templateObject
    ) => {
      const req = new XMLHttpRequest();
      req.open(method.toUpperCase(), source, true);
      req.overrideMimeType("text/html");
      req.withCredentials = withCredentials;
      if (headers) {
        if (checkObject(headers)) {
          for (const header in headers) {
            const [key, value] = header;
            if (typeof value === "string") {
              try {
                req.setRequestHeader(key, value);
              } catch (e) {
                throw e;
              }
            } else {
              createError(`Header has no string value`);
            }
          }
        } else {
          createError(`The "header" property does not have a value object`);
        }
      }
      const isTemplateObject = templateObject !== undefined;
      req.timeout = timeout;
      const updateStatus = () => {
        if (templateObject.status !== req.status)
          templateObject.status = req.status;
      };
      const updateElStatus = (status) => {
        if (status) {
          el.setAttribute(STATUS_ATTR, status);
        } else {
          el.removeAttribute(STATUS_ATTR);
        }
      };
      if (isTemplateObject) {
        req.onabort = updateStatus;
        req.onloadend = updateStatus;
        req.onloadstart = updateStatus;
        req.onprogress = updateStatus;
        req.onreadystatechange = updateStatus;
        req.ontimeout = updateStatus;
      } else {
        req.onprogress = () => updateElStatus("loading");
        req.onabort = () => updateElStatus();
        req.ontimeout = () => updateElStatus();
      }
      req.onload = isTemplateObject
        ? () => {
            updateStatus();
            try {
              if (req.status !== 200) {
                createError(`Request error with code ${req.status}`);
              } else {
                const { response } = req;
                const templateWrapper = getResponseElements(response);
                templateObject.element = templateWrapper;
              }
            } catch (e) {
              throw e;
            }
          }
        : () => {
            updateElStatus();
            try {
              if (req.status !== 200) {
                createError(`Request error with code ${req.status}`);
              } else {
                const { response } = req;
                const templateWrapper = getResponseElements(response);
                const nodes = templateWrapper.content.childNodes;
                if (dataObj) {
                  if (dataObj.nodes) {
                    const newNodes = [];
                    const nodesLength = dataObj.nodes.length;
                    for (let i = 0; i < nodesLength; i++) {
                      const node = dataObj.nodes[i];
                      if (i === nodesLength - 1) {
                        for (let j = 0; j < nodes.length; j++) {
                          const reqNode = nodes[j];
                          const newNode = dataObj.parentNode.insertBefore(
                            reqNode,
                            node
                          );
                          newNodes.push(newNode);
                        }
                      }
                      dataObj.parentNode.removeChild(node);
                    }
                    dataObj.nodes = newNodes;
                  } else {
                    const parentNode = el.parentNode;
                    const newNodes = [];
                    for (let i = 0; i < nodes.length; i++) {
                      const node = nodes[i];
                      const newNode = parentNode.insertBefore(node, el);
                      newNodes.push(newNode);
                    }
                    parentNode.removeChild(el);
                    dataObj.nodes = newNodes;
                    dataObj.parentNode = parentNode;
                  }
                } else {
                  const parentNode = el.parentNode;
                  for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    parentNode.insertBefore(node, el);
                  }
                  parentNode.removeChild(el);
                }
              }
            } catch (e) {
              throw e;
            }
          };
      req.onerror = isTemplateObject
        ? (e) => {
            updateStatus();
            throw e;
          }
        : (e) => {
            updateElStatus();
            throw e;
          };
      if (requestBody !== undefined) {
        req.send(requestBody);
      } else {
        req.send();
      }
    };
    const renderTemplate = (el, fn, isFunction) => {
      const source = el.getAttribute(SOURCE_ATTR);
      if (source) {
        const method = (el.getAttribute(METHOD_ATTR) || "GET").toLowerCase();
        if (getIsMethodValid(method)) {
          createError(
            `${METHOD_ATTR} has only GET, POST, PUT, PATCH or DELETE values`
          );
        } else {
          const after = el.getAttribute(AFTER_ATTR);
          let oldMode = el.getAttribute(MODE_ATTR);
          let mode = (oldMode || "all").toLowerCase();
          if (mode !== "one" && mode !== "all")
            createError(`${MODE_ATTR} has only ONE or ALL values`);
          const isAll = mode === "all";
          let dataObj;
          if (isAll && after) {
            dataObj = {
              nodes: null,
              parentNode: null
            };
          }
          const reqFunction = isFunction
            ? (
                withCredentials,
                timeout,
                headers,
                requestBody,
                templateObject
              ) =>
                makeXMLHttpRequest(
                  undefined,
                  undefined,
                  method,
                  source,
                  withCredentials,
                  timeout,
                  headers,
                  requestBody,
                  templateObject
                )
            : () => {
                makeXMLHttpRequest(el, dataObj, method, source, false, 0);
              };
          let requestFunction = reqFunction;
          if (after) {
            const setEvents = (
              event,
              selector,
              withCredentials,
              timeout,
              headers,
              requestBody,
              templateObject
            ) => {
              const els = doc().querySelectorAll(selector);
              const afterFn = isAll
                ? () => {
                    reqFunction(
                      withCredentials,
                      timeout,
                      headers,
                      requestBody,
                      templateObject
                    );
                  }
                : () => {
                    reqFunction(
                      withCredentials,
                      timeout,
                      headers,
                      requestBody,
                      templateObject
                    );
                    for (let j = 0; j < els.length; j++) {
                      const currentAfterEl = els[j];
                      currentAfterEl.removeEventListener(event, afterFn);
                    }
                  };
              for (let i = 0; i < els.length; i++) {
                const afterEl = els[i];
                afterEl.addEventListener(event, afterFn);
              }
            };
            if (after.indexOf(":") > 0) {
              const afterArr = after.split(":");
              const event = afterArr[0];
              const selector = afterArr.slice(1).join(":");
              requestFunction = (
                withCredentials,
                timeout,
                headers,
                requestBody,
                templateObject
              ) => {
                setEvents(
                  event,
                  selector,
                  withCredentials,
                  timeout,
                  headers,
                  requestBody,
                  templateObject
                );
              };
            } else {
              createError(
                `${AFTER_ATTR} attribute doesn't work without EventTargets`
              );
            }
          } else {
            if (oldMode) {
              createError(
                `${MODE_ATTR} attribute doesn't work without ${AFTER_ATTR}`
              );
            }
          }
          return fn(requestFunction);
        }
      } else {
        createError(`The "source" attribute are not found or empty`);
      }
    };
    /**
     *
     * @param {string} template
     */
    const createTemplate = (template) => {
      if (typeof template !== "string")
        createError(
          "template was not found or the type of the passed value is not string"
        );
      const getElement = (template) => {
        const elementDocument = new DOMParser().parseFromString(
          `<template>${template}</template>`,
          "text/html"
        );
        const elWrapper =
          elementDocument.childNodes[0].childNodes[0].firstChild;
        //@ts-expect-error elWrapper not found
        if (elWrapper.content.children.length > 1) {
          createError("Template include only one node with type 'Element'");
        }
        const prepareNode = (node) => {
          switch (node.nodeType) {
            case Node.ELEMENT_NODE:
              if (node.tagName === "pre") return;
              break;
            case Node.TEXT_NODE:
              if (!/\S/.test(node.textContent)) {
                node.remove();
                return;
              }
              break;
          }
          for (let i = 0; i < node.childNodes.length; i++) {
            prepareNode(node.childNodes.item(i));
          }
        };
        //@ts-expect-error elWrapper not found
        prepareNode(elWrapper.content.childNodes[0]);
        //@ts-expect-error elWrapper not found
        const currentEl = elWrapper.content.firstElementChild;
        if (
          currentEl?.nodeName !== NODE_ATTR ||
          currentEl.getAttribute(CAMPLE_ATTRIBUTE) === null
        ) {
          createError(
            `Other nodes, except those with the name "${NODE_ATTR}" and attribute "${CAMPLE_ATTRIBUTE}", are not yet supported`
          );
        }
        return currentEl;
      };
      const el = getElement(template);
      const renderFn = (requestFunction) => {
        /**
         *
         * @param {{  requestBody?: Document | XMLHttpRequestBodyInit | null;
         *withCredentials?: boolean;
         * headers?:{
         *  [key: string]: string;
         * }
         * timeout?: number;}} options
         * @returns {{ status:number, element: undefined | HTMLTemplateElement }}
         */
        const templateFunction = ({
          withCredentials = false,
          timeout = 0,
          headers,
          requestBody
        } = {}) => {
          const templateObject = {
            element: undefined,
            status: 0
          };
          requestFunction(
            withCredentials,
            timeout,
            headers,
            requestBody,
            templateObject
          );
          return templateObject;
        };
        return templateFunction;
      };
      return renderTemplate(el, renderFn, true);
    };
    const CampleHTML = {
      createTemplate
    };
    const renderFunction = () => {
      const templates = doc().querySelectorAll(`[${CAMPLE_ATTRIBUTE}]`);
      for (let i = 0; i < templates.length; i++) {
        const el = templates[i];
        if (el.parentNode === null) {
          createError(`"parentNode" is null`);
        }
        if (el.nodeName !== NODE_ATTR)
          createError(
            `Other nodes, except those with the name "${NODE_ATTR}", are not yet supported`
          );
        const renderFn = (requestFunction) => {
          requestFunction();
        };
        renderTemplate(el, renderFn);
      }
    };
    if (doc().readyState === "loading") {
      doc().addEventListener("DOMContentLoaded", renderFunction);
    } else renderFunction();
    return CampleHTML;
  })();
});
