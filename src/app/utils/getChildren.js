import React from 'react';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isElement from 'lodash/isElement';
import isEmpty from 'lodash/isEmpty';

const getDom = (item) => {
  let res = '';

  const targets = get(item, '_targets');
  const el = targets && targets.length === 1 ? targets[0] : get(item, 'target');
  const isNode = elm => NodeList.prototype.isPrototypeOf(elm); // eslint-disable-line
  const tag = elm => get(elm, 'tagName');

  if (isNode(el)) {
    const dom = Array.from(el).map(elm => tag(elm)).join(', ');

    res = `[${dom}]`;
  } else if (isArray(el)) {
    const dom = [];

    el.forEach((elm) => {
      if (isNode(elm)) {
        dom.unshift(`NodeList(${elm.length})`);
      } else {
        dom.push(tag(elm).toLowerCase());
      }
    });

    res = `[${dom.join(', ')}]`;
  } else if (isElement(el)) {
    res = tag(el).toLowerCase();
  } else {
    res = '';
  }

  const id = get(el, 'id');
  const classes = get(el, 'className');
  const tagName = res || '';

  const idName = id
    ? `#${get(el, 'id')}`
    : '';

  const className = classes && typeof classes === 'string'
    ? `.${classes.replace(' ', '.')}`
    : '';

  return <p>&nbsp;<span>{tagName}</span><span>{idName}</span><span>{className}</span></p>;
};

const getProperties = (item) => {
  const css = get(item, 'vars.css');
  const vars = get(item, 'vars');

  let res;

  if (css) {
    res = Object.keys(css).join(', ');
  } else if (vars) {
    res = Object.keys(vars).join(', ');
  } else {
    res = '';
  }

  return res;
};

const getStart = (item, offset = 0) => {
  const startTime = item.timeline.startTime();

  return offset === startTime ? startTime : startTime + offset;
};

const getDuration = item => item.timeline.totalDuration();

function getChildren(timeline) {
  if (isEmpty(timeline)) {
    return [];
  }

  const rows = [];
  const parent = timeline.getChildren(false, false, true);

  parent.forEach((t) => {
    const offset = t.startTime();
    const children = t.getChildren(true, true, false);

    children.forEach(tt => rows.push({
      target: getDom(tt),
      start: getStart(tt, offset),
      duration: getDuration(tt),
      properties: getProperties(tt),
      isSet: tt.duration() === 0,
    }));
  });

  return rows;
}

export default getChildren;
