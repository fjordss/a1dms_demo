/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 149:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "l": () => (/* binding */ app)
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(294);
// EXTERNAL MODULE: ./node_modules/react-dom/index.js
var react_dom = __webpack_require__(935);
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
// EXTERNAL MODULE: ./node_modules/prop-types/index.js
var prop_types = __webpack_require__(697);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
function extends_extends() {
  extends_extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return extends_extends.apply(this, arguments);
}
;// CONCATENATED MODULE: ./node_modules/resolve-pathname/esm/resolve-pathname.js
function isAbsolute(pathname) {
  return pathname.charAt(0) === '/';
}

// About 1.5x faster than the two-arg version of Array#splice()
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
    list[i] = list[k];
  }

  list.pop();
}

// This implementation is based heavily on node's url.parse
function resolvePathname(to, from) {
  if (from === undefined) from = '';

  var toParts = (to && to.split('/')) || [];
  var fromParts = (from && from.split('/')) || [];

  var isToAbs = to && isAbsolute(to);
  var isFromAbs = from && isAbsolute(from);
  var mustEndAbs = isToAbs || isFromAbs;

  if (to && isAbsolute(to)) {
    // to is absolute
    fromParts = toParts;
  } else if (toParts.length) {
    // to is relative, drop the filename
    fromParts.pop();
    fromParts = fromParts.concat(toParts);
  }

  if (!fromParts.length) return '/';

  var hasTrailingSlash;
  if (fromParts.length) {
    var last = fromParts[fromParts.length - 1];
    hasTrailingSlash = last === '.' || last === '..' || last === '';
  } else {
    hasTrailingSlash = false;
  }

  var up = 0;
  for (var i = fromParts.length; i >= 0; i--) {
    var part = fromParts[i];

    if (part === '.') {
      spliceOne(fromParts, i);
    } else if (part === '..') {
      spliceOne(fromParts, i);
      up++;
    } else if (up) {
      spliceOne(fromParts, i);
      up--;
    }
  }

  if (!mustEndAbs) for (; up--; up) fromParts.unshift('..');

  if (
    mustEndAbs &&
    fromParts[0] !== '' &&
    (!fromParts[0] || !isAbsolute(fromParts[0]))
  )
    fromParts.unshift('');

  var result = fromParts.join('/');

  if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

  return result;
}

/* harmony default export */ const resolve_pathname = (resolvePathname);

;// CONCATENATED MODULE: ./node_modules/value-equal/esm/value-equal.js
function value_equal_valueOf(obj) {
  return obj.valueOf ? obj.valueOf() : Object.prototype.valueOf.call(obj);
}

function valueEqual(a, b) {
  // Test for strict equality first.
  if (a === b) return true;

  // Otherwise, if either of them == null they are not equal.
  if (a == null || b == null) return false;

  if (Array.isArray(a)) {
    return (
      Array.isArray(b) &&
      a.length === b.length &&
      a.every(function(item, index) {
        return valueEqual(item, b[index]);
      })
    );
  }

  if (typeof a === 'object' || typeof b === 'object') {
    var aValue = value_equal_valueOf(a);
    var bValue = value_equal_valueOf(b);

    if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue);

    return Object.keys(Object.assign({}, a, b)).every(function(key) {
      return valueEqual(a[key], b[key]);
    });
  }

  return false;
}

/* harmony default export */ const value_equal = (valueEqual);

;// CONCATENATED MODULE: ./node_modules/tiny-invariant/dist/tiny-invariant.esm.js
var isProduction = "production" === 'production';
var prefix = 'Invariant failed';
function tiny_invariant_esm_invariant(condition, message) {
    if (condition) {
        return;
    }
    if (isProduction) {
        throw new Error(prefix);
    }
    throw new Error(prefix + ": " + (message || ''));
}

/* harmony default export */ const tiny_invariant_esm = (tiny_invariant_esm_invariant);

;// CONCATENATED MODULE: ./node_modules/history/esm/history.js






function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path;
}
function stripLeadingSlash(path) {
  return path.charAt(0) === '/' ? path.substr(1) : path;
}
function hasBasename(path, prefix) {
  return path.toLowerCase().indexOf(prefix.toLowerCase()) === 0 && '/?#'.indexOf(path.charAt(prefix.length)) !== -1;
}
function stripBasename(path, prefix) {
  return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
}
function stripTrailingSlash(path) {
  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
}
function parsePath(path) {
  var pathname = path || '/';
  var search = '';
  var hash = '';
  var hashIndex = pathname.indexOf('#');

  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex);
    pathname = pathname.substr(0, hashIndex);
  }

  var searchIndex = pathname.indexOf('?');

  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex);
    pathname = pathname.substr(0, searchIndex);
  }

  return {
    pathname: pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  };
}
function createPath(location) {
  var pathname = location.pathname,
      search = location.search,
      hash = location.hash;
  var path = pathname || '/';
  if (search && search !== '?') path += search.charAt(0) === '?' ? search : "?" + search;
  if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : "#" + hash;
  return path;
}

function createLocation(path, state, key, currentLocation) {
  var location;

  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = parsePath(path);
    location.state = state;
  } else {
    // One-arg form: push(location)
    location = extends_extends({}, path);
    if (location.pathname === undefined) location.pathname = '';

    if (location.search) {
      if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
    } else {
      location.search = '';
    }

    if (location.hash) {
      if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
    } else {
      location.hash = '';
    }

    if (state !== undefined && location.state === undefined) location.state = state;
  }

  try {
    location.pathname = decodeURI(location.pathname);
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.');
    } else {
      throw e;
    }
  }

  if (key) location.key = key;

  if (currentLocation) {
    // Resolve incomplete/relative pathname relative to current location.
    if (!location.pathname) {
      location.pathname = currentLocation.pathname;
    } else if (location.pathname.charAt(0) !== '/') {
      location.pathname = resolve_pathname(location.pathname, currentLocation.pathname);
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    if (!location.pathname) {
      location.pathname = '/';
    }
  }

  return location;
}
function locationsAreEqual(a, b) {
  return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && value_equal(a.state, b.state);
}

function createTransitionManager() {
  var prompt = null;

  function setPrompt(nextPrompt) {
     false ? 0 : void 0;
    prompt = nextPrompt;
    return function () {
      if (prompt === nextPrompt) prompt = null;
    };
  }

  function confirmTransitionTo(location, action, getUserConfirmation, callback) {
    // TODO: If another transition starts while we're still confirming
    // the previous one, we may end up in a weird state. Figure out the
    // best way to handle this.
    if (prompt != null) {
      var result = typeof prompt === 'function' ? prompt(location, action) : prompt;

      if (typeof result === 'string') {
        if (typeof getUserConfirmation === 'function') {
          getUserConfirmation(result, callback);
        } else {
           false ? 0 : void 0;
          callback(true);
        }
      } else {
        // Return false from a transition hook to cancel the transition.
        callback(result !== false);
      }
    } else {
      callback(true);
    }
  }

  var listeners = [];

  function appendListener(fn) {
    var isActive = true;

    function listener() {
      if (isActive) fn.apply(void 0, arguments);
    }

    listeners.push(listener);
    return function () {
      isActive = false;
      listeners = listeners.filter(function (item) {
        return item !== listener;
      });
    };
  }

  function notifyListeners() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    listeners.forEach(function (listener) {
      return listener.apply(void 0, args);
    });
  }

  return {
    setPrompt: setPrompt,
    confirmTransitionTo: confirmTransitionTo,
    appendListener: appendListener,
    notifyListeners: notifyListeners
  };
}

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
function getConfirmation(message, callback) {
  callback(window.confirm(message)); // eslint-disable-line no-alert
}
/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */

function supportsHistory() {
  var ua = window.navigator.userAgent;
  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) return false;
  return window.history && 'pushState' in window.history;
}
/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */

function supportsPopStateOnHashChange() {
  return window.navigator.userAgent.indexOf('Trident') === -1;
}
/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */

function supportsGoWithoutReloadUsingHash() {
  return window.navigator.userAgent.indexOf('Firefox') === -1;
}
/**
 * Returns true if a given popstate event is an extraneous WebKit event.
 * Accounts for the fact that Chrome on iOS fires real popstate events
 * containing undefined state when pressing the back button.
 */

function isExtraneousPopstateEvent(event) {
  return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
}

var PopStateEvent = 'popstate';
var HashChangeEvent = 'hashchange';

function getHistoryState() {
  try {
    return window.history.state || {};
  } catch (e) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/ReactTraining/history/pull/289
    return {};
  }
}
/**
 * Creates a history object that uses the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */


function createBrowserHistory(props) {
  if (props === void 0) {
    props = {};
  }

  !canUseDOM ?  false ? 0 : tiny_invariant_esm(false) : void 0;
  var globalHistory = window.history;
  var canUseHistory = supportsHistory();
  var needsHashChangeListener = !supportsPopStateOnHashChange();
  var _props = props,
      _props$forceRefresh = _props.forceRefresh,
      forceRefresh = _props$forceRefresh === void 0 ? false : _props$forceRefresh,
      _props$getUserConfirm = _props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
      _props$keyLength = _props.keyLength,
      keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';

  function getDOMLocation(historyState) {
    var _ref = historyState || {},
        key = _ref.key,
        state = _ref.state;

    var _window$location = window.location,
        pathname = _window$location.pathname,
        search = _window$location.search,
        hash = _window$location.hash;
    var path = pathname + search + hash;
     false ? 0 : void 0;
    if (basename) path = stripBasename(path, basename);
    return createLocation(path, state, key);
  }

  function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  }

  var transitionManager = createTransitionManager();

  function setState(nextState) {
    extends_extends(history, nextState);

    history.length = globalHistory.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  function handlePopState(event) {
    // Ignore extraneous popstate events in WebKit.
    if (isExtraneousPopstateEvent(event)) return;
    handlePop(getDOMLocation(event.state));
  }

  function handleHashChange() {
    handlePop(getDOMLocation(getHistoryState()));
  }

  var forceNextPop = false;

  function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({
            action: action,
            location: location
          });
        } else {
          revertPop(location);
        }
      });
    }
  }

  function revertPop(fromLocation) {
    var toLocation = history.location; // TODO: We could probably make this more reliable by
    // keeping a list of keys we've seen in sessionStorage.
    // Instead, we just default to 0 for keys we don't know.

    var toIndex = allKeys.indexOf(toLocation.key);
    if (toIndex === -1) toIndex = 0;
    var fromIndex = allKeys.indexOf(fromLocation.key);
    if (fromIndex === -1) fromIndex = 0;
    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  }

  var initialLocation = getDOMLocation(getHistoryState());
  var allKeys = [initialLocation.key]; // Public interface

  function createHref(location) {
    return basename + createPath(location);
  }

  function push(path, state) {
     false ? 0 : void 0;
    var action = 'PUSH';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var href = createHref(location);
      var key = location.key,
          state = location.state;

      if (canUseHistory) {
        globalHistory.pushState({
          key: key,
          state: state
        }, null, href);

        if (forceRefresh) {
          window.location.href = href;
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          var nextKeys = allKeys.slice(0, prevIndex + 1);
          nextKeys.push(location.key);
          allKeys = nextKeys;
          setState({
            action: action,
            location: location
          });
        }
      } else {
         false ? 0 : void 0;
        window.location.href = href;
      }
    });
  }

  function replace(path, state) {
     false ? 0 : void 0;
    var action = 'REPLACE';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var href = createHref(location);
      var key = location.key,
          state = location.state;

      if (canUseHistory) {
        globalHistory.replaceState({
          key: key,
          state: state
        }, null, href);

        if (forceRefresh) {
          window.location.replace(href);
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          if (prevIndex !== -1) allKeys[prevIndex] = location.key;
          setState({
            action: action,
            location: location
          });
        }
      } else {
         false ? 0 : void 0;
        window.location.replace(href);
      }
    });
  }

  function go(n) {
    globalHistory.go(n);
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  var listenerCount = 0;

  function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1 && delta === 1) {
      window.addEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener) window.addEventListener(HashChangeEvent, handleHashChange);
    } else if (listenerCount === 0) {
      window.removeEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener) window.removeEventListener(HashChangeEvent, handleHashChange);
    }
  }

  var isBlocked = false;

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  }

  function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);
    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  }

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };
  return history;
}

var HashChangeEvent$1 = 'hashchange';
var HashPathCoders = {
  hashbang: {
    encodePath: function encodePath(path) {
      return path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path);
    },
    decodePath: function decodePath(path) {
      return path.charAt(0) === '!' ? path.substr(1) : path;
    }
  },
  noslash: {
    encodePath: stripLeadingSlash,
    decodePath: addLeadingSlash
  },
  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash
  }
};

function stripHash(url) {
  var hashIndex = url.indexOf('#');
  return hashIndex === -1 ? url : url.slice(0, hashIndex);
}

function getHashPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var hashIndex = href.indexOf('#');
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
}

function pushHashPath(path) {
  window.location.hash = path;
}

function replaceHashPath(path) {
  window.location.replace(stripHash(window.location.href) + '#' + path);
}

function createHashHistory(props) {
  if (props === void 0) {
    props = {};
  }

  !canUseDOM ?  false ? 0 : tiny_invariant_esm(false) : void 0;
  var globalHistory = window.history;
  var canGoWithoutReload = supportsGoWithoutReloadUsingHash();
  var _props = props,
      _props$getUserConfirm = _props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm,
      _props$hashType = _props.hashType,
      hashType = _props$hashType === void 0 ? 'slash' : _props$hashType;
  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';
  var _HashPathCoders$hashT = HashPathCoders[hashType],
      encodePath = _HashPathCoders$hashT.encodePath,
      decodePath = _HashPathCoders$hashT.decodePath;

  function getDOMLocation() {
    var path = decodePath(getHashPath());
     false ? 0 : void 0;
    if (basename) path = stripBasename(path, basename);
    return createLocation(path);
  }

  var transitionManager = createTransitionManager();

  function setState(nextState) {
    extends_extends(history, nextState);

    history.length = globalHistory.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  var forceNextPop = false;
  var ignorePath = null;

  function locationsAreEqual$$1(a, b) {
    return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash;
  }

  function handleHashChange() {
    var path = getHashPath();
    var encodedPath = encodePath(path);

    if (path !== encodedPath) {
      // Ensure we always have a properly-encoded hash.
      replaceHashPath(encodedPath);
    } else {
      var location = getDOMLocation();
      var prevLocation = history.location;
      if (!forceNextPop && locationsAreEqual$$1(prevLocation, location)) return; // A hashchange doesn't always == location change.

      if (ignorePath === createPath(location)) return; // Ignore this change; we already setState in push/replace.

      ignorePath = null;
      handlePop(location);
    }
  }

  function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({
            action: action,
            location: location
          });
        } else {
          revertPop(location);
        }
      });
    }
  }

  function revertPop(fromLocation) {
    var toLocation = history.location; // TODO: We could probably make this more reliable by
    // keeping a list of paths we've seen in sessionStorage.
    // Instead, we just default to 0 for paths we don't know.

    var toIndex = allPaths.lastIndexOf(createPath(toLocation));
    if (toIndex === -1) toIndex = 0;
    var fromIndex = allPaths.lastIndexOf(createPath(fromLocation));
    if (fromIndex === -1) fromIndex = 0;
    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  } // Ensure the hash is encoded properly before doing anything else.


  var path = getHashPath();
  var encodedPath = encodePath(path);
  if (path !== encodedPath) replaceHashPath(encodedPath);
  var initialLocation = getDOMLocation();
  var allPaths = [createPath(initialLocation)]; // Public interface

  function createHref(location) {
    var baseTag = document.querySelector('base');
    var href = '';

    if (baseTag && baseTag.getAttribute('href')) {
      href = stripHash(window.location.href);
    }

    return href + '#' + encodePath(basename + createPath(location));
  }

  function push(path, state) {
     false ? 0 : void 0;
    var action = 'PUSH';
    var location = createLocation(path, undefined, undefined, history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var path = createPath(location);
      var encodedPath = encodePath(basename + path);
      var hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a PUSH, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        pushHashPath(encodedPath);
        var prevIndex = allPaths.lastIndexOf(createPath(history.location));
        var nextPaths = allPaths.slice(0, prevIndex + 1);
        nextPaths.push(path);
        allPaths = nextPaths;
        setState({
          action: action,
          location: location
        });
      } else {
         false ? 0 : void 0;
        setState();
      }
    });
  }

  function replace(path, state) {
     false ? 0 : void 0;
    var action = 'REPLACE';
    var location = createLocation(path, undefined, undefined, history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var path = createPath(location);
      var encodedPath = encodePath(basename + path);
      var hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a REPLACE, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        replaceHashPath(encodedPath);
      }

      var prevIndex = allPaths.indexOf(createPath(history.location));
      if (prevIndex !== -1) allPaths[prevIndex] = path;
      setState({
        action: action,
        location: location
      });
    });
  }

  function go(n) {
     false ? 0 : void 0;
    globalHistory.go(n);
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  var listenerCount = 0;

  function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1 && delta === 1) {
      window.addEventListener(HashChangeEvent$1, handleHashChange);
    } else if (listenerCount === 0) {
      window.removeEventListener(HashChangeEvent$1, handleHashChange);
    }
  }

  var isBlocked = false;

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  }

  function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);
    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  }

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };
  return history;
}

function clamp(n, lowerBound, upperBound) {
  return Math.min(Math.max(n, lowerBound), upperBound);
}
/**
 * Creates a history object that stores locations in memory.
 */


function createMemoryHistory(props) {
  if (props === void 0) {
    props = {};
  }

  var _props = props,
      getUserConfirmation = _props.getUserConfirmation,
      _props$initialEntries = _props.initialEntries,
      initialEntries = _props$initialEntries === void 0 ? ['/'] : _props$initialEntries,
      _props$initialIndex = _props.initialIndex,
      initialIndex = _props$initialIndex === void 0 ? 0 : _props$initialIndex,
      _props$keyLength = _props.keyLength,
      keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
  var transitionManager = createTransitionManager();

  function setState(nextState) {
    extends_extends(history, nextState);

    history.length = history.entries.length;
    transitionManager.notifyListeners(history.location, history.action);
  }

  function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  }

  var index = clamp(initialIndex, 0, initialEntries.length - 1);
  var entries = initialEntries.map(function (entry) {
    return typeof entry === 'string' ? createLocation(entry, undefined, createKey()) : createLocation(entry, undefined, entry.key || createKey());
  }); // Public interface

  var createHref = createPath;

  function push(path, state) {
     false ? 0 : void 0;
    var action = 'PUSH';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      var prevIndex = history.index;
      var nextIndex = prevIndex + 1;
      var nextEntries = history.entries.slice(0);

      if (nextEntries.length > nextIndex) {
        nextEntries.splice(nextIndex, nextEntries.length - nextIndex, location);
      } else {
        nextEntries.push(location);
      }

      setState({
        action: action,
        location: location,
        index: nextIndex,
        entries: nextEntries
      });
    });
  }

  function replace(path, state) {
     false ? 0 : void 0;
    var action = 'REPLACE';
    var location = createLocation(path, state, createKey(), history.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;
      history.entries[history.index] = location;
      setState({
        action: action,
        location: location
      });
    });
  }

  function go(n) {
    var nextIndex = clamp(history.index + n, 0, history.entries.length - 1);
    var action = 'POP';
    var location = history.entries[nextIndex];
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (ok) {
        setState({
          action: action,
          location: location,
          index: nextIndex
        });
      } else {
        // Mimic the behavior of DOM histories by
        // causing a render after a cancelled POP.
        setState();
      }
    });
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  function canGo(n) {
    var nextIndex = history.index + n;
    return nextIndex >= 0 && nextIndex < history.entries.length;
  }

  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }

    return transitionManager.setPrompt(prompt);
  }

  function listen(listener) {
    return transitionManager.appendListener(listener);
  }

  var history = {
    length: entries.length,
    action: 'POP',
    location: entries[index],
    index: index,
    entries: entries,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    canGo: canGo,
    block: block,
    listen: listen
  };
  return history;
}



;// CONCATENATED MODULE: ./node_modules/mini-create-react-context/dist/esm/index.js





var MAX_SIGNED_31_BIT_INT = 1073741823;
var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : {};

function getUniqueId() {
  var key = '__global_unique_id__';
  return commonjsGlobal[key] = (commonjsGlobal[key] || 0) + 1;
}

function objectIs(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

function createEventEmitter(value) {
  var handlers = [];
  return {
    on: function on(handler) {
      handlers.push(handler);
    },
    off: function off(handler) {
      handlers = handlers.filter(function (h) {
        return h !== handler;
      });
    },
    get: function get() {
      return value;
    },
    set: function set(newValue, changedBits) {
      value = newValue;
      handlers.forEach(function (handler) {
        return handler(value, changedBits);
      });
    }
  };
}

function onlyChild(children) {
  return Array.isArray(children) ? children[0] : children;
}

function createReactContext(defaultValue, calculateChangedBits) {
  var _Provider$childContex, _Consumer$contextType;

  var contextProp = '__create-react-context-' + getUniqueId() + '__';

  var Provider = /*#__PURE__*/function (_Component) {
    _inheritsLoose(Provider, _Component);

    function Provider() {
      var _this;

      _this = _Component.apply(this, arguments) || this;
      _this.emitter = createEventEmitter(_this.props.value);
      return _this;
    }

    var _proto = Provider.prototype;

    _proto.getChildContext = function getChildContext() {
      var _ref;

      return _ref = {}, _ref[contextProp] = this.emitter, _ref;
    };

    _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      if (this.props.value !== nextProps.value) {
        var oldValue = this.props.value;
        var newValue = nextProps.value;
        var changedBits;

        if (objectIs(oldValue, newValue)) {
          changedBits = 0;
        } else {
          changedBits = typeof calculateChangedBits === 'function' ? calculateChangedBits(oldValue, newValue) : MAX_SIGNED_31_BIT_INT;

          if (false) {}

          changedBits |= 0;

          if (changedBits !== 0) {
            this.emitter.set(nextProps.value, changedBits);
          }
        }
      }
    };

    _proto.render = function render() {
      return this.props.children;
    };

    return Provider;
  }(react.Component);

  Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[contextProp] = (prop_types_default()).object.isRequired, _Provider$childContex);

  var Consumer = /*#__PURE__*/function (_Component2) {
    _inheritsLoose(Consumer, _Component2);

    function Consumer() {
      var _this2;

      _this2 = _Component2.apply(this, arguments) || this;
      _this2.state = {
        value: _this2.getValue()
      };

      _this2.onUpdate = function (newValue, changedBits) {
        var observedBits = _this2.observedBits | 0;

        if ((observedBits & changedBits) !== 0) {
          _this2.setState({
            value: _this2.getValue()
          });
        }
      };

      return _this2;
    }

    var _proto2 = Consumer.prototype;

    _proto2.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      var observedBits = nextProps.observedBits;
      this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT : observedBits;
    };

    _proto2.componentDidMount = function componentDidMount() {
      if (this.context[contextProp]) {
        this.context[contextProp].on(this.onUpdate);
      }

      var observedBits = this.props.observedBits;
      this.observedBits = observedBits === undefined || observedBits === null ? MAX_SIGNED_31_BIT_INT : observedBits;
    };

    _proto2.componentWillUnmount = function componentWillUnmount() {
      if (this.context[contextProp]) {
        this.context[contextProp].off(this.onUpdate);
      }
    };

    _proto2.getValue = function getValue() {
      if (this.context[contextProp]) {
        return this.context[contextProp].get();
      } else {
        return defaultValue;
      }
    };

    _proto2.render = function render() {
      return onlyChild(this.props.children)(this.state.value);
    };

    return Consumer;
  }(react.Component);

  Consumer.contextTypes = (_Consumer$contextType = {}, _Consumer$contextType[contextProp] = (prop_types_default()).object, _Consumer$contextType);
  return {
    Provider: Provider,
    Consumer: Consumer
  };
}

var index = react.createContext || createReactContext;

/* harmony default export */ const esm = (index);

// EXTERNAL MODULE: ./node_modules/path-to-regexp/index.js
var path_to_regexp = __webpack_require__(779);
var path_to_regexp_default = /*#__PURE__*/__webpack_require__.n(path_to_regexp);
// EXTERNAL MODULE: ./node_modules/react-router/node_modules/react-is/index.js
var react_is = __webpack_require__(663);
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function objectWithoutPropertiesLoose_objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}
// EXTERNAL MODULE: ./node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js
var hoist_non_react_statics_cjs = __webpack_require__(679);
;// CONCATENATED MODULE: ./node_modules/react-router/esm/react-router.js













// TODO: Replace with React.createContext once we can assume React 16+

var createNamedContext = function createNamedContext(name) {
  var context = esm();
  context.displayName = name;
  return context;
};

var historyContext =
/*#__PURE__*/
createNamedContext("Router-History");

// TODO: Replace with React.createContext once we can assume React 16+

var createNamedContext$1 = function createNamedContext(name) {
  var context = esm();
  context.displayName = name;
  return context;
};

var context =
/*#__PURE__*/
createNamedContext$1("Router");

/**
 * The public API for putting history on context.
 */

var Router =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Router, _React$Component);

  Router.computeRootMatch = function computeRootMatch(pathname) {
    return {
      path: "/",
      url: "/",
      params: {},
      isExact: pathname === "/"
    };
  };

  function Router(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      location: props.history.location
    }; // This is a bit of a hack. We have to start listening for location
    // changes here in the constructor in case there are any <Redirect>s
    // on the initial render. If there are, they will replace/push when
    // they mount and since cDM fires in children before parents, we may
    // get a new location before the <Router> is mounted.

    _this._isMounted = false;
    _this._pendingLocation = null;

    if (!props.staticContext) {
      _this.unlisten = props.history.listen(function (location) {
        if (_this._isMounted) {
          _this.setState({
            location: location
          });
        } else {
          _this._pendingLocation = location;
        }
      });
    }

    return _this;
  }

  var _proto = Router.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this._isMounted = true;

    if (this._pendingLocation) {
      this.setState({
        location: this._pendingLocation
      });
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.unlisten) this.unlisten();
  };

  _proto.render = function render() {
    return react.createElement(context.Provider, {
      value: {
        history: this.props.history,
        location: this.state.location,
        match: Router.computeRootMatch(this.state.location.pathname),
        staticContext: this.props.staticContext
      }
    }, react.createElement(historyContext.Provider, {
      children: this.props.children || null,
      value: this.props.history
    }));
  };

  return Router;
}(react.Component);

if (false) {}

/**
 * The public API for a <Router> that stores location in memory.
 */

var MemoryRouter =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(MemoryRouter, _React$Component);

  function MemoryRouter() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.history = createMemoryHistory(_this.props);
    return _this;
  }

  var _proto = MemoryRouter.prototype;

  _proto.render = function render() {
    return react.createElement(Router, {
      history: this.history,
      children: this.props.children
    });
  };

  return MemoryRouter;
}(react.Component);

if (false) {}

var Lifecycle =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Lifecycle, _React$Component);

  function Lifecycle() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Lifecycle.prototype;

  _proto.componentDidMount = function componentDidMount() {
    if (this.props.onMount) this.props.onMount.call(this, this);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this.props.onUpdate) this.props.onUpdate.call(this, this, prevProps);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.props.onUnmount) this.props.onUnmount.call(this, this);
  };

  _proto.render = function render() {
    return null;
  };

  return Lifecycle;
}(react.Component);

/**
 * The public API for prompting the user before navigating away from a screen.
 */

function Prompt(_ref) {
  var message = _ref.message,
      _ref$when = _ref.when,
      when = _ref$when === void 0 ? true : _ref$when;
  return React.createElement(context.Consumer, null, function (context) {
    !context ?  false ? 0 : invariant(false) : void 0;
    if (!when || context.staticContext) return null;
    var method = context.history.block;
    return React.createElement(Lifecycle, {
      onMount: function onMount(self) {
        self.release = method(message);
      },
      onUpdate: function onUpdate(self, prevProps) {
        if (prevProps.message !== message) {
          self.release();
          self.release = method(message);
        }
      },
      onUnmount: function onUnmount(self) {
        self.release();
      },
      message: message
    });
  });
}

if (false) { var messageType; }

var cache = {};
var cacheLimit = 10000;
var cacheCount = 0;

function compilePath(path) {
  if (cache[path]) return cache[path];
  var generator = path_to_regexp_default().compile(path);

  if (cacheCount < cacheLimit) {
    cache[path] = generator;
    cacheCount++;
  }

  return generator;
}
/**
 * Public API for generating a URL pathname from a path and parameters.
 */


function generatePath(path, params) {
  if (path === void 0) {
    path = "/";
  }

  if (params === void 0) {
    params = {};
  }

  return path === "/" ? path : compilePath(path)(params, {
    pretty: true
  });
}

/**
 * The public API for navigating programmatically with a component.
 */

function Redirect(_ref) {
  var computedMatch = _ref.computedMatch,
      to = _ref.to,
      _ref$push = _ref.push,
      push = _ref$push === void 0 ? false : _ref$push;
  return react.createElement(context.Consumer, null, function (context) {
    !context ?  false ? 0 : tiny_invariant_esm(false) : void 0;
    var history = context.history,
        staticContext = context.staticContext;
    var method = push ? history.push : history.replace;
    var location = createLocation(computedMatch ? typeof to === "string" ? generatePath(to, computedMatch.params) : extends_extends({}, to, {
      pathname: generatePath(to.pathname, computedMatch.params)
    }) : to); // When rendering in a static context,
    // set the new location immediately.

    if (staticContext) {
      method(location);
      return null;
    }

    return react.createElement(Lifecycle, {
      onMount: function onMount() {
        method(location);
      },
      onUpdate: function onUpdate(self, prevProps) {
        var prevLocation = createLocation(prevProps.to);

        if (!locationsAreEqual(prevLocation, extends_extends({}, location, {
          key: prevLocation.key
        }))) {
          method(location);
        }
      },
      to: to
    });
  });
}

if (false) {}

var cache$1 = {};
var cacheLimit$1 = 10000;
var cacheCount$1 = 0;

function compilePath$1(path, options) {
  var cacheKey = "" + options.end + options.strict + options.sensitive;
  var pathCache = cache$1[cacheKey] || (cache$1[cacheKey] = {});
  if (pathCache[path]) return pathCache[path];
  var keys = [];
  var regexp = path_to_regexp_default()(path, keys, options);
  var result = {
    regexp: regexp,
    keys: keys
  };

  if (cacheCount$1 < cacheLimit$1) {
    pathCache[path] = result;
    cacheCount$1++;
  }

  return result;
}
/**
 * Public API for matching a URL pathname to a path.
 */


function matchPath(pathname, options) {
  if (options === void 0) {
    options = {};
  }

  if (typeof options === "string" || Array.isArray(options)) {
    options = {
      path: options
    };
  }

  var _options = options,
      path = _options.path,
      _options$exact = _options.exact,
      exact = _options$exact === void 0 ? false : _options$exact,
      _options$strict = _options.strict,
      strict = _options$strict === void 0 ? false : _options$strict,
      _options$sensitive = _options.sensitive,
      sensitive = _options$sensitive === void 0 ? false : _options$sensitive;
  var paths = [].concat(path);
  return paths.reduce(function (matched, path) {
    if (!path && path !== "") return null;
    if (matched) return matched;

    var _compilePath = compilePath$1(path, {
      end: exact,
      strict: strict,
      sensitive: sensitive
    }),
        regexp = _compilePath.regexp,
        keys = _compilePath.keys;

    var match = regexp.exec(pathname);
    if (!match) return null;
    var url = match[0],
        values = match.slice(1);
    var isExact = pathname === url;
    if (exact && !isExact) return null;
    return {
      path: path,
      // the path used to match
      url: path === "/" && url === "" ? "/" : url,
      // the matched portion of the URL
      isExact: isExact,
      // whether or not we matched exactly
      params: keys.reduce(function (memo, key, index) {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}

function isEmptyChildren(children) {
  return React.Children.count(children) === 0;
}

function evalChildrenDev(children, props, path) {
  var value = children(props);
   false ? 0 : void 0;
  return value || null;
}
/**
 * The public API for matching a single path and rendering.
 */


var Route =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Route, _React$Component);

  function Route() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Route.prototype;

  _proto.render = function render() {
    var _this = this;

    return react.createElement(context.Consumer, null, function (context$1) {
      !context$1 ?  false ? 0 : tiny_invariant_esm(false) : void 0;
      var location = _this.props.location || context$1.location;
      var match = _this.props.computedMatch ? _this.props.computedMatch // <Switch> already computed the match for us
      : _this.props.path ? matchPath(location.pathname, _this.props) : context$1.match;

      var props = extends_extends({}, context$1, {
        location: location,
        match: match
      });

      var _this$props = _this.props,
          children = _this$props.children,
          component = _this$props.component,
          render = _this$props.render; // Preact uses an empty array as children by
      // default, so use null if that's the case.

      if (Array.isArray(children) && children.length === 0) {
        children = null;
      }

      return react.createElement(context.Provider, {
        value: props
      }, props.match ? children ? typeof children === "function" ?  false ? 0 : children(props) : children : component ? react.createElement(component, props) : render ? render(props) : null : typeof children === "function" ?  false ? 0 : children(props) : null);
    });
  };

  return Route;
}(react.Component);

if (false) {}

function react_router_addLeadingSlash(path) {
  return path.charAt(0) === "/" ? path : "/" + path;
}

function addBasename(basename, location) {
  if (!basename) return location;
  return extends_extends({}, location, {
    pathname: react_router_addLeadingSlash(basename) + location.pathname
  });
}

function react_router_stripBasename(basename, location) {
  if (!basename) return location;
  var base = react_router_addLeadingSlash(basename);
  if (location.pathname.indexOf(base) !== 0) return location;
  return extends_extends({}, location, {
    pathname: location.pathname.substr(base.length)
  });
}

function createURL(location) {
  return typeof location === "string" ? location : createPath(location);
}

function staticHandler(methodName) {
  return function () {
      false ? 0 : tiny_invariant_esm(false) ;
  };
}

function noop() {}
/**
 * The public top-level API for a "static" <Router>, so-called because it
 * can't actually change the current location. Instead, it just records
 * location changes in a context object. Useful mainly in testing and
 * server-rendering scenarios.
 */


var StaticRouter =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(StaticRouter, _React$Component);

  function StaticRouter() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _this.handlePush = function (location) {
      return _this.navigateTo(location, "PUSH");
    };

    _this.handleReplace = function (location) {
      return _this.navigateTo(location, "REPLACE");
    };

    _this.handleListen = function () {
      return noop;
    };

    _this.handleBlock = function () {
      return noop;
    };

    return _this;
  }

  var _proto = StaticRouter.prototype;

  _proto.navigateTo = function navigateTo(location, action) {
    var _this$props = this.props,
        _this$props$basename = _this$props.basename,
        basename = _this$props$basename === void 0 ? "" : _this$props$basename,
        _this$props$context = _this$props.context,
        context = _this$props$context === void 0 ? {} : _this$props$context;
    context.action = action;
    context.location = addBasename(basename, createLocation(location));
    context.url = createURL(context.location);
  };

  _proto.render = function render() {
    var _this$props2 = this.props,
        _this$props2$basename = _this$props2.basename,
        basename = _this$props2$basename === void 0 ? "" : _this$props2$basename,
        _this$props2$context = _this$props2.context,
        context = _this$props2$context === void 0 ? {} : _this$props2$context,
        _this$props2$location = _this$props2.location,
        location = _this$props2$location === void 0 ? "/" : _this$props2$location,
        rest = objectWithoutPropertiesLoose_objectWithoutPropertiesLoose(_this$props2, ["basename", "context", "location"]);

    var history = {
      createHref: function createHref(path) {
        return react_router_addLeadingSlash(basename + createURL(path));
      },
      action: "POP",
      location: react_router_stripBasename(basename, createLocation(location)),
      push: this.handlePush,
      replace: this.handleReplace,
      go: staticHandler("go"),
      goBack: staticHandler("goBack"),
      goForward: staticHandler("goForward"),
      listen: this.handleListen,
      block: this.handleBlock
    };
    return react.createElement(Router, extends_extends({}, rest, {
      history: history,
      staticContext: context
    }));
  };

  return StaticRouter;
}(react.Component);

if (false) {}

/**
 * The public API for rendering the first <Route> that matches.
 */

var Switch =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Switch, _React$Component);

  function Switch() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Switch.prototype;

  _proto.render = function render() {
    var _this = this;

    return react.createElement(context.Consumer, null, function (context) {
      !context ?  false ? 0 : tiny_invariant_esm(false) : void 0;
      var location = _this.props.location || context.location;
      var element, match; // We use React.Children.forEach instead of React.Children.toArray().find()
      // here because toArray adds keys to all child elements and we do not want
      // to trigger an unmount/remount for two <Route>s that render the same
      // component at different URLs.

      react.Children.forEach(_this.props.children, function (child) {
        if (match == null && react.isValidElement(child)) {
          element = child;
          var path = child.props.path || child.props.from;
          match = path ? matchPath(location.pathname, extends_extends({}, child.props, {
            path: path
          })) : context.match;
        }
      });
      return match ? react.cloneElement(element, {
        location: location,
        computedMatch: match
      }) : null;
    });
  };

  return Switch;
}(react.Component);

if (false) {}

/**
 * A public higher-order component to access the imperative API
 */

function withRouter(Component) {
  var displayName = "withRouter(" + (Component.displayName || Component.name) + ")";

  var C = function C(props) {
    var wrappedComponentRef = props.wrappedComponentRef,
        remainingProps = _objectWithoutPropertiesLoose(props, ["wrappedComponentRef"]);

    return React.createElement(context.Consumer, null, function (context) {
      !context ?  false ? 0 : invariant(false) : void 0;
      return React.createElement(Component, _extends({}, remainingProps, context, {
        ref: wrappedComponentRef
      }));
    });
  };

  C.displayName = displayName;
  C.WrappedComponent = Component;

  if (false) {}

  return hoistStatics(C, Component);
}

var useContext = react.useContext;
function useHistory() {
  if (false) {}

  return useContext(historyContext);
}
function useLocation() {
  if (false) {}

  return useContext(context).location;
}
function useParams() {
  if (false) {}

  var match = useContext(context).match;
  return match ? match.params : {};
}
function useRouteMatch(path) {
  if (false) {}

  var location = useLocation();
  var match = useContext(context).match;
  return path ? matchPath(location.pathname, path) : match;
}

if (false) { var secondaryBuildName, initialBuildName, buildNames, key, global; }


//# sourceMappingURL=react-router.js.map

;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/Access.js


class Access extends react.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let policy = this.props.app.accessPolicies.get(this.props.policy);
        if (!policy())
            return react.createElement(Redirect, { to: this.props.app.accessDeniedUrl });
        return (react.createElement(react.Fragment, null));
    }
}
//# sourceMappingURL=Access.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/DateRangePicker.js

class DateRangePicker extends react.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (react.createElement("div", { className: "date-range-picker" },
            react.createElement("div", null,
                react.createElement("a", { href: "", onClick: e => this.rangeSelected(e, "cd") }, "Today")),
            react.createElement("div", null,
                react.createElement("a", { href: "", onClick: e => this.rangeSelected(e, "pd") }, "Yesterday")),
            react.createElement("div", null,
                react.createElement("a", { href: "", onClick: e => this.rangeSelected(e, "cw") }, "Current Week")),
            react.createElement("div", null,
                react.createElement("a", { href: "", onClick: e => this.rangeSelected(e, "pw") }, "Previous Week")),
            react.createElement("div", null,
                react.createElement("a", { href: "", onClick: e => this.rangeSelected(e, "cm") }, "Current Month")),
            react.createElement("div", null,
                react.createElement("a", { href: "", onClick: e => this.rangeSelected(e, "pm") }, "Previous Month"))));
    }
    rangeSelected(e, type) {
        e.preventDefault();
        if (!this.props.onChange)
            return;
        let from;
        let to;
        [from, to] = DateRangePicker.getRange(type);
        this.props.onChange(from, to);
    }
    static getRange(type) {
        let onChange = (from, to) => [DateRangePicker.dateToString(from), to ? DateRangePicker.dateToString(to) : null];
        let now = new Date();
        if (type == "cw" || type == "pw") {
            let sunday = this.addDays(now, -(now.getDay() == 0 ? 0 : now.getDay()));
            if (type == "cw")
                return onChange(sunday);
            else
                return onChange(this.addDays(sunday, -7), this.addDays(sunday, -1));
        }
        else if (type == "cm" || type == "pm") {
            let monthStart = this.addDays(now, -now.getDate() + 1);
            if (type == "cm")
                return onChange(monthStart);
            else
                return onChange(this.addMonths(monthStart, -1), this.addDays(monthStart, -1));
        }
        else {
            if (type == "cd")
                return onChange(now, now);
            else
                return onChange(this.addDays(now, -1), this.addDays(now, -1));
        }
    }
    static dateToString(date) {
        return date.getFullYear() + "-" + (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1) + "-" + (date.getDate() < 10 ? "0" : "") + date.getDate();
    }
    static addDays(date, days) {
        let result = new Date(date);
        result.setDate(date.getDate() + days);
        return result;
    }
    static addMonths(date, months) {
        let result = new Date(date);
        result.setMonth(date.getMonth() + months);
        return result;
    }
}
//# sourceMappingURL=DateRangePicker.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/FetchData.js

class FetchData extends react.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (react.createElement(react.Fragment, null));
    }
    componentDidMount() {
        let promise = new Promise((resolve, reject) => {
            fetch(this.props.url)
                .then(r => r.json())
                .then((data) => {
                if (this.props.map)
                    resolve(this.props.map(data));
                else
                    resolve(data);
            })
                .catch(error => console.error(error));
        });
        this.props.obj[this.props.prop] = promise;
        if (this.props.after)
            this.props.after();
    }
}
//# sourceMappingURL=FetchData.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/Modal.js

class Modal extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.toBool(this.props.visible),
            header: this.props.header
        };
    }
    render() {
        if (!this.props.visible)
            return react.createElement(react.Fragment, null);
        if (!this.props.loading) {
            let css = {};
            if (typeof (this.props.width) != "undefined")
                css.width = this.props.width + "px";
            if (typeof (this.props.height) != "undefined")
                css.height = this.props.height + "px";
            return (react.createElement("div", { className: this.getClassName("overlay"), onClick: () => this.close() },
                react.createElement("div", { style: css, className: this.getClassName("front"), onClick: e => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                    } },
                    this.canBeClosed() ? react.createElement("img", { src: "/images/closepic.png", className: this.getClassName("close"), onClick: () => this.close() }) : react.createElement(react.Fragment, null),
                    react.createElement("div", { className: this.getClassName("main") },
                        this.props.header ? react.createElement("div", { className: this.getClassName("header") }, this.props.header) : react.createElement(react.Fragment, null),
                        react.createElement("div", { className: this.getClassName("body") }, this.props.children),
                        this.props.header ? react.createElement("div", { className: this.getClassName("header") + " hidden" }, "\u00A0") : react.createElement(react.Fragment, null)))));
        }
        else {
            return react.createElement(Modal, { className: "preloader", width: 295, height: 175, canBeClosed: false, visible: !!this.props.visible });
        }
    }
    componentDidMount() {
        if (Modal.instances.filter(m => m == this).length == 0)
            Modal.instances.push(this);
        this.changeBodyOverflow();
    }
    componentDidUpdate() {
        this.changeBodyOverflow();
    }
    componentWillUnmount() {
        Modal.instances = Modal.instances.filter(m => m != this);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps != null) {
            let visible = this.toBool(nextProps.visible);
            if (visible != this.state.visible) {
                this.setState({ visible });
                return false;
            }
        }
        return true;
    }
    canBeClosed() {
        return typeof (this.props.canBeClosed) == "undefined" || this.props.canBeClosed === true;
    }
    changeBodyOverflow() {
        let allHidden = true;
        for (let modal of Modal.instances) {
            if (modal.props.visible) {
                allHidden = false;
                break;
            }
        }
        document.body.style.overflow = allHidden ? "" : "hidden";
    }
    close() {
        if (!this.canBeClosed())
            return;
        this.setState({ visible: false });
        if (this.props.onClose)
            this.props.onClose();
    }
    toBool(arg) {
        return (arg === true || arg === false) ? arg : false;
    }
    getClassName(postfix = null) {
        let base = "modal" + (postfix ? "-" + postfix : "");
        return base + (this.props.className ? " " + base + "-" + this.props.className : "");
    }
}
Modal.instances = [];
//# sourceMappingURL=Modal.js.map
;// CONCATENATED MODULE: ./node_modules/react-router-dom/esm/react-router-dom.js











/**
 * The public API for a <Router> that uses HTML5 history.
 */

var BrowserRouter =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(BrowserRouter, _React$Component);

  function BrowserRouter() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.history = createBrowserHistory(_this.props);
    return _this;
  }

  var _proto = BrowserRouter.prototype;

  _proto.render = function render() {
    return react.createElement(Router, {
      history: this.history,
      children: this.props.children
    });
  };

  return BrowserRouter;
}(react.Component);

if (false) {}

/**
 * The public API for a <Router> that uses window.location.hash.
 */

var HashRouter =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(HashRouter, _React$Component);

  function HashRouter() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.history = createHashHistory(_this.props);
    return _this;
  }

  var _proto = HashRouter.prototype;

  _proto.render = function render() {
    return react.createElement(Router, {
      history: this.history,
      children: this.props.children
    });
  };

  return HashRouter;
}(react.Component);

if (false) {}

var resolveToLocation = function resolveToLocation(to, currentLocation) {
  return typeof to === "function" ? to(currentLocation) : to;
};
var normalizeToLocation = function normalizeToLocation(to, currentLocation) {
  return typeof to === "string" ? createLocation(to, null, null, currentLocation) : to;
};

var forwardRefShim = function forwardRefShim(C) {
  return C;
};

var forwardRef = react.forwardRef;

if (typeof forwardRef === "undefined") {
  forwardRef = forwardRefShim;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

var LinkAnchor = forwardRef(function (_ref, forwardedRef) {
  var innerRef = _ref.innerRef,
      navigate = _ref.navigate,
      _onClick = _ref.onClick,
      rest = objectWithoutPropertiesLoose_objectWithoutPropertiesLoose(_ref, ["innerRef", "navigate", "onClick"]);

  var target = rest.target;

  var props = extends_extends({}, rest, {
    onClick: function onClick(event) {
      try {
        if (_onClick) _onClick(event);
      } catch (ex) {
        event.preventDefault();
        throw ex;
      }

      if (!event.defaultPrevented && // onClick prevented default
      event.button === 0 && ( // ignore everything but left clicks
      !target || target === "_self") && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
      ) {
          event.preventDefault();
          navigate();
        }
    }
  }); // React 15 compat


  if (forwardRefShim !== forwardRef) {
    props.ref = forwardedRef || innerRef;
  } else {
    props.ref = innerRef;
  }
  /* eslint-disable-next-line jsx-a11y/anchor-has-content */


  return react.createElement("a", props);
});

if (false) {}
/**
 * The public API for rendering a history-aware <a>.
 */


var Link = forwardRef(function (_ref2, forwardedRef) {
  var _ref2$component = _ref2.component,
      component = _ref2$component === void 0 ? LinkAnchor : _ref2$component,
      replace = _ref2.replace,
      to = _ref2.to,
      innerRef = _ref2.innerRef,
      rest = objectWithoutPropertiesLoose_objectWithoutPropertiesLoose(_ref2, ["component", "replace", "to", "innerRef"]);

  return react.createElement(context.Consumer, null, function (context) {
    !context ?  false ? 0 : tiny_invariant_esm(false) : void 0;
    var history = context.history;
    var location = normalizeToLocation(resolveToLocation(to, context.location), context.location);
    var href = location ? history.createHref(location) : "";

    var props = extends_extends({}, rest, {
      href: href,
      navigate: function navigate() {
        var location = resolveToLocation(to, context.location);
        var method = replace ? history.replace : history.push;
        method(location);
      }
    }); // React 15 compat


    if (forwardRefShim !== forwardRef) {
      props.ref = forwardedRef || innerRef;
    } else {
      props.innerRef = innerRef;
    }

    return react.createElement(component, props);
  });
});

if (false) { var refType, toType; }

var forwardRefShim$1 = function forwardRefShim(C) {
  return C;
};

var forwardRef$1 = react.forwardRef;

if (typeof forwardRef$1 === "undefined") {
  forwardRef$1 = forwardRefShim$1;
}

function joinClassnames() {
  for (var _len = arguments.length, classnames = new Array(_len), _key = 0; _key < _len; _key++) {
    classnames[_key] = arguments[_key];
  }

  return classnames.filter(function (i) {
    return i;
  }).join(" ");
}
/**
 * A <Link> wrapper that knows if it's "active" or not.
 */


var NavLink = forwardRef$1(function (_ref, forwardedRef) {
  var _ref$ariaCurrent = _ref["aria-current"],
      ariaCurrent = _ref$ariaCurrent === void 0 ? "page" : _ref$ariaCurrent,
      _ref$activeClassName = _ref.activeClassName,
      activeClassName = _ref$activeClassName === void 0 ? "active" : _ref$activeClassName,
      activeStyle = _ref.activeStyle,
      classNameProp = _ref.className,
      exact = _ref.exact,
      isActiveProp = _ref.isActive,
      locationProp = _ref.location,
      sensitive = _ref.sensitive,
      strict = _ref.strict,
      styleProp = _ref.style,
      to = _ref.to,
      innerRef = _ref.innerRef,
      rest = objectWithoutPropertiesLoose_objectWithoutPropertiesLoose(_ref, ["aria-current", "activeClassName", "activeStyle", "className", "exact", "isActive", "location", "sensitive", "strict", "style", "to", "innerRef"]);

  return react.createElement(context.Consumer, null, function (context) {
    !context ?  false ? 0 : tiny_invariant_esm(false) : void 0;
    var currentLocation = locationProp || context.location;
    var toLocation = normalizeToLocation(resolveToLocation(to, currentLocation), currentLocation);
    var path = toLocation.pathname; // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202

    var escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
    var match = escapedPath ? matchPath(currentLocation.pathname, {
      path: escapedPath,
      exact: exact,
      sensitive: sensitive,
      strict: strict
    }) : null;
    var isActive = !!(isActiveProp ? isActiveProp(match, currentLocation) : match);
    var className = isActive ? joinClassnames(classNameProp, activeClassName) : classNameProp;
    var style = isActive ? extends_extends({}, styleProp, {}, activeStyle) : styleProp;

    var props = extends_extends({
      "aria-current": isActive && ariaCurrent || null,
      className: className,
      style: style,
      to: toLocation
    }, rest); // React 15 compat


    if (forwardRefShim$1 !== forwardRef$1) {
      props.ref = forwardedRef || innerRef;
    } else {
      props.innerRef = innerRef;
    }

    return react.createElement(Link, props);
  });
});

if (false) { var ariaCurrentType; }


//# sourceMappingURL=react-router-dom.js.map

;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/ModalError.js



class ModalError extends react.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let errors = [];
        for (let i = 0; i < this.props.errors.length; i++) {
            errors.push(react.createElement("span", null, this.props.errors[i]));
            if (i != this.props.errors.length - 1)
                errors.push(react.createElement("br", null));
        }
        return (react.createElement(Modal, { className: "error", width: 295, height: 175, visible: this.props.visible, onClose: this.props.onClose },
            react.createElement("div", { className: "text" }, errors),
            this.props.backLabel && this.props.backUrl ?
                react.createElement("div", { className: "back" },
                    react.createElement(Link, { to: this.props.backUrl }, this.props.backLabel)) :
                react.createElement(react.Fragment, null)));
    }
}
//# sourceMappingURL=ModalError.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/Notification.js

class Notification extends react.Component {
    constructor(props) {
        super(props);
        this.counter = 0;
        props.app.notification = this;
        this.state = {
            visible: false,
            body: [],
            timeout: 3000
        };
    }
    render() {
        this.elementRef = react.createRef();
        if (this.state.visible) {
            this.counter = 0;
            setTimeout(() => this.timeout(), 100);
        }
        return (react.createElement("div", { ref: this.elementRef, className: this.getClassName() + (this.state.visible ? " visible" : ""), onMouseMove: () => this.counter = 0, onMouseLeave: () => this.counter = this.state.timeout - 300 }, this.state.body));
    }
    show(body) {
        this.setState({
            visible: true,
            body
        });
    }
    timeout() {
        this.counter += 100;
        if (this.counter >= this.state.timeout)
            this.close();
        else
            setTimeout(() => this.timeout(), 100);
    }
    close() {
        let element = this.elementRef.current;
        element.classList.remove("visible");
        this.setState({ visible: false });
    }
    getClassName(postfix = null) {
        let base = "notification" + (postfix ? "-" + postfix : "");
        return base + (this.props.className ? " " + base + "-" + this.props.className : "");
    }
}
//# sourceMappingURL=Notification.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/Select.js

class Select extends react.Component {
    constructor(props) {
        super(props);
        this.selectClick = false;
        this.dropdownClick = false;
        this.hideDropdown = () => {
            if (this.selectClick) {
                this.selectClick = false;
                return;
            }
            if (this.dropdownClick) {
                this.dropdownClick = false;
                return;
            }
            this.setState({ dropdownVisible: false });
        };
        this.state = { dropdownVisible: false };
        this.options = this.handleOptionsArray(this.props.options);
        this.values = this.props.values ? this.props.values.map(v => v.toString()) : [];
    }
    render() {
        if (this.props.selectFirst && this.values.length == 0 && this.options.length > 0)
            this.values.push(this.options[0].value ? this.options[0].value : this.options[0].text);
        let selected = this.options.filter(opt => this.values.indexOf(opt.value) != -1).map(opt => opt.text).join(", ");
        return (react.createElement("div", { className: "select" + (this.props.disabled === true ? " disabled" : ""), style: this.props.width ? { width: this.props.width + "px" } : {} },
            react.createElement("div", { className: "select-header", onClick: e => this.toggleDropdown(e) },
                react.createElement("div", { className: "select-placeholder" + (selected ? " hidden" : "") }, this.props.placeholder ? this.props.placeholder : "None selected"),
                react.createElement("div", { className: "select-values" + (!selected ? " hidden" : "") }, selected)),
            react.createElement("div", { className: "select-dropdown" + (!this.state.dropdownVisible ? " hidden" : ""), style: this.props.dropdownWidth ? { width: this.props.dropdownWidth } : null }, this.options.map((opt, i) => (react.createElement("div", { className: "select-option " + (this.values.indexOf(opt.value) != -1 ? "selected" : "notselected") + (opt.disabled ? " disabled" : ""), onClick: (e) => this.onSelected(e, opt) },
                this.props.multiple ?
                    react.createElement("input", { className: "select-option-flag", type: "checkbox", checked: this.values.indexOf(opt.value) != -1, disabled: opt.disabled }) :
                    react.createElement("input", { className: "select-option-flag", type: "radio", checked: this.values.indexOf(opt.value) != -1, disabled: opt.disabled }),
                react.createElement("span", { className: "select-option-label" }, opt.text)))))));
    }
    componentWillUpdate(nextProps, nextState) {
        if (nextProps.values)
            this.values = nextProps.values.map(v => v.toString());
        if (nextProps.options)
            this.options = this.handleOptionsArray(nextProps.options);
    }
    componentDidMount() {
        document.body.addEventListener("click", this.hideDropdown);
    }
    componentWillUnmount() {
        document.body.removeEventListener("click", this.hideDropdown);
    }
    handleOptionsArray(options) {
        let newOptions = [];
        let list = options;
        if (list.length > 0) {
            if (typeof (list[0]) === "string")
                newOptions = options.map(opt => { return { text: opt }; });
            else
                newOptions = options;
        }
        newOptions.forEach(opt => {
            opt.text = opt.text.toString();
            opt.value = opt.value ? opt.value.toString() : opt.text;
        });
        return newOptions;
    }
    toggleDropdown(e) {
        this.selectClick = true;
        if (this.props.disabled === true)
            return;
        this.setState({ dropdownVisible: !this.state.dropdownVisible });
    }
    onSelected(e, opt) {
        this.dropdownClick = true;
        if (opt.disabled)
            return;
        if (!this.props.multiple) {
            this.values = [opt.value];
            this.dropdownClick = false;
            this.hideDropdown();
        }
        else {
            if (this.values.indexOf(opt.value) == -1)
                this.values.push(opt.value);
            else
                this.values = this.values.filter(v => v != opt.value);
        }
        if (this.props.onChange)
            this.props.onChange(this.values);
        this.setState({});
    }
}
//# sourceMappingURL=Select.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/form/Form.js

var FormType;
(function (FormType) {
    FormType[FormType["new"] = 0] = "new";
    FormType[FormType["edit"] = 1] = "edit";
})(FormType || (FormType = {}));
var FormFieldType;
(function (FormFieldType) {
    FormFieldType[FormFieldType["singleline"] = 0] = "singleline";
    FormFieldType[FormFieldType["multiline"] = 1] = "multiline";
    FormFieldType[FormFieldType["checkbox"] = 2] = "checkbox";
    FormFieldType[FormFieldType["select"] = 3] = "select";
    FormFieldType[FormFieldType["multiselect"] = 4] = "multiselect";
    FormFieldType[FormFieldType["datetime"] = 5] = "datetime";
})(FormFieldType || (FormFieldType = {}));
class Form extends react.Component {
    constructor(props) {
        super(props);
        Form.instance = this;
    }
    render() {
        return (react.createElement("div", { className: this.props.className }, this.props.children));
    }
    componentDidMount() {
        let fields = Form.getInstance().props.fields;
        for (let field of fields)
            field.value = typeof (field.value) != "undefined" ? field.value : Form.getInitValue(field);
    }
    static onSubmit() {
        let form = Form.getInstance();
        let url = form.props.url;
        let method = form.props.method;
        let fields = form.props.fields;
        if (form.errorElement)
            form.errorElement.setState({ errors: [] });
        if (Form.validate(fields)) {
            if (form.props.send)
                form.props.send();
            Form.sendRequest(method, url ? url : location.href, fields).then(data => {
                if (data.status == "ok" && form.props.success)
                    form.props.success(data);
                if (data.status == "error") {
                    if (form.props.error)
                        form.props.error(data);
                    Form.handleError(data.errors);
                }
            }, error => {
                if (form.props.error)
                    form.props.error(null);
                Form.handleError([{ text: Form.unknownError }]);
            });
        }
    }
    static getInstance() {
        return Form.instance;
    }
    static handleError(errors) {
        let form = Form.getInstance();
        let fields = form.props.fields;
        if (!errors)
            return;
        let formErrors = [];
        for (let error of errors) {
            if (!error.text)
                continue;
            if (error.field) {
                let field = fields.find(f => f.name == error.field);
                if (field && field.fieldErrorElement) {
                    field.error = error.text;
                    field.fieldErrorElement.setState({});
                }
            }
            else
                formErrors.push(error.text);
        }
        if (form.errorElement)
            form.errorElement.setState({ errors: formErrors });
    }
    static sendRequest(method, url, fields = null) {
        let requestInfo = {
            method: method,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: this.getBody(fields)
        };
        return new Promise((resolve, reject) => {
            fetch(url, requestInfo)
                .then(response => response.json())
                .then((data) => resolve(data))
                .catch(error => reject(error));
        });
    }
    static getBody(fields) {
        let getValue = value => typeof (value) != "undefined" && value != null ? value : "";
        if (!fields)
            return null;
        let body = [];
        for (let field of fields) {
            let value = field.mapValue ? field.mapValue(field.value) : field.value;
            if (Array.isArray(value)) {
                for (let item of value)
                    body.push(field.name + "=" + encodeURIComponent(getValue(item)));
            }
            else
                body.push(field.name + "=" + encodeURIComponent(getValue(value)));
        }
        console.log(body.join("&"));
        return body.join("&");
    }
    static validate(fields) {
        let success = true;
        for (let field of fields) {
            if (field.required) {
                let select = field.type == FormFieldType.select || field.type == FormFieldType.multiselect;
                let input = field.type == FormFieldType.singleline || field.type == FormFieldType.multiline || field.type == FormFieldType.datetime;
                let error;
                if (select && (!field.value || field.value.length == 0))
                    error = Form.requiredFieldError;
                else if (input && !(typeof (field.value) != "undefined" && field.value != null ? field.value.trim() : null))
                    error = Form.requiredFieldError;
                if (error) {
                    field.error = error;
                    success = false;
                }
                else
                    field.error = null;
            }
            if (!field.error && field.validate) {
                let result;
                let error;
                [result, error] = field.validate(field.value);
                if (!result) {
                    field.error = error ? error : Form.requiredFieldError;
                    success = false;
                }
                else
                    field.error = null;
            }
            if (field.fieldErrorElement)
                field.fieldErrorElement.setState({});
        }
        return success;
    }
    static getInitValue(field) {
        if (field.type == FormFieldType.singleline || field.type == FormFieldType.multiline || field.type == FormFieldType.select || field.type == FormFieldType.datetime)
            return "";
        else if (field.type == FormFieldType.checkbox)
            return false;
        else if (field.type == FormFieldType.multiselect)
            return [];
    }
}
Form.requiredFieldError = "This field is required";
Form.unknownError = "Unknown error occured, please try again";
Form.unknownErrorWithRefresh = "Unknown error occured, please refresh page and try again";
//# sourceMappingURL=Form.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/form/FormError.js


class FormError extends react.Component {
    constructor(props) {
        super(props);
        Form.getInstance().errorElement = this;
        this.state = { errors: [] };
    }
    render() {
        let errors = [];
        for (let i = 0; i < this.state.errors.length; i++) {
            errors.push(react.createElement("span", null, this.state.errors[i]));
            if (i != this.state.errors.length - 1)
                errors.push(react.createElement("br", null));
        }
        return (react.createElement("span", null, errors));
    }
}
//# sourceMappingURL=FormError.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/form/FormField.js



class FormField extends react.Component {
    constructor(props) {
        super(props);
        this.props.field.fieldElement = this;
    }
    render() {
        return (react.createElement(react.Fragment, null, this.getField(this.props.field)));
    }
    getField(field) {
        if (!field) {
            console.error("Field '" + name + "' not found");
            return;
        }
        if (field.visible === false)
            return react.createElement(react.Fragment, null);
        if (field.type == FormFieldType.singleline) {
            return react.createElement("input", { type: "text", id: field.id, className: field.className, disabled: !!field.disabled, placeholder: field.placeholder, name: field.name, value: field.value, onChange: e => this.onChange(e) });
        }
        else if (field.type == FormFieldType.multiline) {
            return react.createElement("textarea", { id: field.id, className: field.className, disabled: !!field.disabled, name: field.name, onChange: e => this.onChange(e), value: field.value });
        }
        else if (field.type == FormFieldType.checkbox) {
            return react.createElement("input", { type: "checkbox", id: field.id, className: field.className, disabled: !!field.disabled, name: field.name, checked: field.value, onChange: e => this.onChange(e) });
        }
        else if (field.type == FormFieldType.datetime) {
            return react.createElement("input", { type: "date", id: field.id, className: field.className, disabled: !!field.disabled, name: field.name, value: field.value, onChange: e => this.onChange(e) });
        }
        else if (field.type == FormFieldType.select || field.type == FormFieldType.multiselect) {
            return react.createElement(Select, { width: 400, options: field.options, multiple: field.type == FormFieldType.multiselect, disabled: !!field.disabled, onChange: values => this.onChangeSelect(field.name, field.type == FormFieldType.multiselect ? values : values[0], field.type == FormFieldType.multiselect), placeholder: field.placeholder, values: field.value ? (Array.isArray(field.value) ? field.value.map(v => v.toString()) : [field.value.toString()]) : null });
        }
        return react.createElement(react.Fragment, null);
    }
    onChangeSelect(name, value, multiple) {
        let form = Form.getInstance();
        let fields = form.props.fields;
        let field = fields.find(f => f.name == name);
        if (field)
            field.value = value;
        if (field.onChange)
            field.onChange(field.value);
        field.fieldElement.setState({});
    }
    onChange(e) {
        let form = Form.getInstance();
        let fields = form.props.fields;
        let element = e.currentTarget;
        let tag = element.tagName.toLowerCase();
        let name = element.getAttribute("name");
        if (!name) {
            console.error("Element has no 'name' attribute");
            return;
        }
        let field = fields.find(f => f.name == name);
        if (tag == "input") {
            let type = element.getAttribute("type");
            if (type) {
                if (type == "text" || type == "date")
                    field.value = element.value;
                else if (type == "checkbox")
                    field.value = element.checked;
                else {
                    console.error("Unknown type of input");
                    return;
                }
            }
        }
        else if (tag == "textarea")
            field.value = element.value;
        if (field.onChange)
            field.onChange(field.value);
        field.fieldElement.setState({});
    }
}
//# sourceMappingURL=FormField.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/form/FormFieldError.js

class FormFieldError extends react.Component {
    constructor(props) {
        super(props);
        this.props.field.fieldErrorElement = this;
    }
    render() {
        return (react.createElement("span", null, this.props.field.error));
    }
}
//# sourceMappingURL=FormFieldError.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/form/FormFieldLabel.js

class FormFieldLabel extends react.Component {
    constructor(props) {
        super(props);
        this.props.field.fieldLabelElement = this;
    }
    render() {
        return (react.createElement("label", { htmlFor: this.props.field.id },
            this.props.field.displayName ? this.props.field.displayName : this.props.field.name,
            this.props.field.required === true ? react.createElement("span", { className: "required" }, " *") : react.createElement(react.Fragment, null)));
    }
}
//# sourceMappingURL=FormFieldLabel.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/form/FormSubmit.js


class FormSubmit extends react.Component {
    render() {
        return (react.createElement(react.Fragment, null, this.getSubmit(this.props.submit)));
    }
    getSubmit(submit) {
        return react.createElement("button", { id: submit.id, className: submit.className, onClick: Form.onSubmit }, submit.value);
    }
}
//# sourceMappingURL=FormSubmit.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/table/TableContextMenu.js

class TableContextMenu extends react.Component {
    constructor(props) {
        super(props);
        this.rowHover = (e, remove = false) => {
            let hoverClass = "tv-context-menu-hover";
            let element = e.currentTarget;
            let near = element.classList.contains("tv-context-menu-label") ? element.previousElementSibling : element.nextElementSibling;
            !remove ? element.classList.add(hoverClass) : element.classList.remove(hoverClass);
            !remove ? near.classList.add(hoverClass) : near.classList.remove(hoverClass);
        };
    }
    render() {
        return (react.createElement("div", { className: this.getClassName("context-menu") },
            react.createElement("div", { className: this.getClassName("context-menu-grid") }, this.props.items.map(item => react.createElement(react.Fragment, null,
                react.createElement("div", { className: this.getClassName("context-menu-icon"), onClick: () => this.handleClick(item), onMouseEnter: e => this.rowHover(e), onMouseLeave: e => this.rowHover(e, true) }, item.icon),
                react.createElement("div", { className: this.getClassName("context-menu-label"), onClick: () => this.handleClick(item), onMouseEnter: e => this.rowHover(e), onMouseLeave: e => this.rowHover(e, true) }, item.label))))));
    }
    handleClick(item) {
        if (item.action)
            item.action();
        else if (item.route && this.props.onRedirect)
            this.props.onRedirect(item.route);
    }
    getClassName(postfix = null) {
        let base = "tv" + (postfix ? "-" + postfix : "");
        return base + (this.props.className ? " " + base + "-" + this.props.className : "");
    }
}
//# sourceMappingURL=TableContextMenu.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/helpers/Utility.js
class utility {
    static createGuid() {
        let d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
    static convertDate(date, withTime = false) {
        let newDate = "";
        if (date) {
            let parts = date.split("T");
            let dateParts = parts[0].split("-");
            let add = "";
            if (withTime) {
                let timeParts = parts[1].split(":");
                add = timeParts[0] + ":" + timeParts[1];
            }
            newDate = dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0] + (add ? " " + add : "");
        }
        return newDate;
    }
}
//# sourceMappingURL=Utility.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/table/TableFlag.js


class TableFlag extends react.Component {
    render() {
        let id = this.props.id ? this.props.id : utility.createGuid();
        return (react.createElement("div", { className: this.props.className ? this.props.className : "" },
            react.createElement("input", { type: "checkbox", id: id, checked: this.props.checked, onClick: this.props.onClick }),
            " ",
            react.createElement("label", { htmlFor: id }, this.props.label)));
    }
}
//# sourceMappingURL=TableFlag.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/table/TableHeaderMenu.js



class TableHeaderMenu extends react.Component {
    constructor(props) {
        super(props);
        this.setSearchValue = (value, startSearch = false) => {
            this.setState({ search: value });
            if (startSearch) {
                this.props.onSearchApply(this.props.column.internalName, value);
            }
        };
        this.state = {
            allSelected: this.props.choices.length == this.props.selected.length || this.props.selected.length == 0,
            selected: this.props.selected,
            choices: this.props.choices,
            search: this.props.search,
            order: this.props.order,
            filterSearchString: null
        };
    }
    render() {
        let filterings = [];
        if (this.state.choices) {
            let search = this.state.filterSearchString ? this.state.filterSearchString.trim().toLowerCase() : "";
            for (let choice of this.state.choices) {
                if (search && choice.toLowerCase().indexOf(search) == -1)
                    continue;
                filterings.push(react.createElement(TableFlag, { label: choice, checked: this.state.allSelected || this.state.selected.indexOf(choice) != -1, onClick: e => this.onSelected(e) }));
            }
        }
        this.searchInputRef = react.createRef();
        return (react.createElement("div", { className: this.getClassName("filter-menu") + (this.props.last ? " last" : ""), onClick: this.stopPropagation },
            this.props.column.sortable ?
                react.createElement("div", { className: this.getClassName("filter-menu-sorting") },
                    react.createElement("div", null,
                        react.createElement("span", { onClick: () => this.applySort(TableSortType.asc), className: this.getClassName("sort-label") + (this.state.order == TableSortType.asc ? " selected" : "") },
                            react.createElement("i", { className: this.getClassName("sort-icon") + " fas fa-sort-alpha-down" }),
                            react.createElement("span", null, "A to Z"))),
                    react.createElement("div", null,
                        react.createElement("span", { onClick: () => this.applySort(TableSortType.desc), className: this.getClassName("sort-label") + (this.state.order == TableSortType.desc ? " selected" : "") },
                            react.createElement("i", { className: this.getClassName("sort-icon") + " fas fa-sort-alpha-down-alt" }),
                            react.createElement("span", null, "Z to A")))) :
                react.createElement(react.Fragment, null),
            this.props.column.sortable && (this.props.column.filterable || this.props.column.searchable) ?
                react.createElement("hr", { className: this.getClassName("line") }) :
                react.createElement(react.Fragment, null),
            this.props.column.searchable ?
                react.createElement("div", { className: this.getClassName("filter-menu-search-grid") },
                    react.createElement("input", { className: this.getClassName("filter-menu-search"), type: "text", placeholder: "Search in this column", onChange: e => this.setSearchValue(e.currentTarget.value), onKeyPress: e => e.key == "Enter" ? this.setSearchValue(e.currentTarget.value, true) : {}, value: this.state.search, ref: this.searchInputRef }),
                    react.createElement("button", { className: this.getClassName("filter-menu-search-button"), onClick: e => this.setSearchValue(this.searchInputRef.current.value, true) },
                        react.createElement("i", { className: "fas fa-angle-double-right" }))) :
                react.createElement(react.Fragment, null),
            this.props.column.searchable && this.props.column.filterable ?
                react.createElement("hr", { className: this.getClassName("line") }) :
                react.createElement(react.Fragment, null),
            this.props.column.filterable ?
                react.createElement(react.Fragment, null,
                    react.createElement("input", { type: "text", className: this.getClassName("filter-menu-filter-search"), onChange: e => this.searchFilters(e), value: this.state.filterSearchString }),
                    react.createElement(TableFlag, { id: "all", label: "All", onClick: () => this.onAllSelected(), checked: this.state.allSelected }),
                    react.createElement("div", { className: this.getClassName("filter-menu-filtering") }, filterings),
                    react.createElement("div", { className: this.getClassName("filter-apply") },
                        react.createElement("button", { className: this.getClassName("filter-apply-button") + (this.state.allSelected || this.state.selected.length == 0 ? " disabled" : ""), onClick: () => this.applyFilters() }, "Apply Filter"),
                        react.createElement("button", { className: this.getClassName("filter-reset-button") + (!this.props.filterApplied ? " hidden" : ""), onClick: () => this.resetFilter() }, "Reset Filter"))) :
                react.createElement(react.Fragment, null)));
    }
    searchFilters(e) {
        this.setState({ filterSearchString: e.currentTarget.value });
    }
    applySort(sortOrder) {
        this.props.onSortApply(this.props.column.internalName, sortOrder);
    }
    applyFilters() {
        if (this.state.selected.length == 0 || this.state.allSelected)
            return;
        this.props.onFilterApply(this.props.column.internalName, this.state.selected);
    }
    resetFilter() {
        this.props.onFilterReset(this.props.column.internalName);
    }
    onSelected(e) {
        let choice = e.currentTarget.parentElement.querySelector("label[for='" + e.currentTarget.id + "']").innerHTML;
        let allSelected = this.state.allSelected;
        let selected = this.state.selected;
        if (allSelected) {
            allSelected = false;
            selected = this.props.choices;
        }
        if (selected.indexOf(choice) != -1) {
            selected = selected.filter(c => c != choice);
            if (allSelected)
                allSelected = false;
        }
        else
            selected.push(choice);
        if (this.state.choices.length == selected.length)
            allSelected = true;
        this.setState({
            allSelected,
            selected
        });
    }
    onAllSelected() {
        this.setState({
            allSelected: !this.state.allSelected,
            selected: !this.state.allSelected ? this.state.choices : []
        });
    }
    getClassName(postfix = null) {
        let base = "tv" + (postfix ? "-" + postfix : "");
        return base + (this.props.className ? " " + base + "-" + this.props.className : "");
    }
    stopPropagation(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
}
//# sourceMappingURL=TableHeaderMenu.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/table/TableHeaderCell.js


class TableHeaderCell extends react.Component {
    constructor(props) {
        super(props);
        this.filterClicked = false;
        this.onFilterApply = (field, choices) => {
            this.setState({ showFilteringMenu: false });
            this.props.onFilterApply(field, choices);
        };
        this.onFilterReset = (field) => {
            this.setState({ showFilteringMenu: false });
            this.props.onFilterReset(field);
        };
        this.onSortApply = (field, sortType) => {
            this.setState({ showFilteringMenu: false });
            this.props.onSortApply(field, sortType);
        };
        this.onSearchApply = (field, search) => {
            this.setState({ showFilteringMenu: false });
            this.props.onSearchApply(field, search);
        };
        this.showFilter = (e, column) => {
            this.setState({ showFilteringMenu: true });
            this.filterClicked = true;
        };
        this.closeFilters = () => {
            if (this.filterClicked) {
                this.filterClicked = false;
                return;
            }
            if (this.state.showFilteringMenu)
                this.setState({ showFilteringMenu: false });
        };
        this.state = {
            showFilteringMenu: false
        };
    }
    render() {
        return (react.createElement(react.Fragment, null,
            react.createElement("div", { className: this.getClassName("header-cell") + (this.props.column.headerCellClass ? " " + this.props.column.headerCellClass : "") + (this.props.additionalClass ? " " + this.props.additionalClass : "") },
                react.createElement("div", { className: this.getClassName("header-cell-inner") },
                    react.createElement("div", { className: this.getClassName("header-cell-label") }, this.props.column.label),
                    this.getFilterArrow(this.props.column)),
                this.state.showFilteringMenu ?
                    react.createElement(TableHeaderMenu, { column: this.props.column, choices: this.props.choices, selected: this.props.selected, search: this.props.search, className: this.props.className, order: this.props.sort, filterApplied: this.props.filterApplied, onFilterApply: this.onFilterApply, onFilterReset: this.onFilterReset, onSortApply: this.onSortApply, onSearchApply: this.onSearchApply, last: this.props.last }) :
                    react.createElement(react.Fragment, null))));
    }
    componentDidMount() {
        document.body.addEventListener("click", this.closeFilters);
    }
    componentWillUnmount() {
        document.body.removeEventListener("click", this.closeFilters);
    }
    getFilterArrow(column) {
        let getClassName = () => {
            let name = this.getClassName("filter-icon");
            name += (this.props.filtersLoaded); // && (this.props.column.filterable || this.props.column.sortable || this.props.column.searchable) ? " tv-visible" : " tv-hidden");
            name += (this.props.filterApplied || this.props.searchApplied ? " tv-selected" : "");
            return name;
        };
        return (react.createElement("div", { className: getClassName() },
            react.createElement("i", { className: "fas fa-filter", onClick: e => this.showFilter(e, column) })));
    }
    getClassName(postfix = null) {
        let base = "tv" + (postfix ? "-" + postfix : "");
        return base + (this.props.className ? " " + base + "-" + this.props.className : "");
    }
}
//# sourceMappingURL=TableHeaderCell.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/table/TableDefaultHeader.js


class TableDefaultHeader extends react.Component {
    constructor(props) {
        super(props);
        this.onFilterApply = (field, choices) => {
            this.props.onFilterApply(field, choices);
        };
        this.onFilterReset = (field) => {
            this.props.onFilterReset(field);
        };
        this.onSortApply = (field, sortType) => {
            this.props.onSortApply(field, sortType);
        };
        this.onSearchApply = (field, search) => {
            this.props.onSearchApply(field, search);
        };
        this.state = {
            filteringFieldName: null
        };
    }
    render() {
        let cells = [];
        let children = [];
        if (this.props.children) {
            if (Array.isArray(this.props.children))
                children = this.props.children.map(c => c);
            else
                children.push(this.props.children);
            children.forEach((child, i) => {
                if (typeof (child.type) === "string")
                    cells.push(child);
                else if (child.type.name == "TableHeaderCell")
                    cells.push(this.getHeaderCell(child.props.column, child.props.additionalClass, i == children.length - 1));
            });
        }
        else {
            for (let i = 0; i < this.props.columns.length; i++) {
                let column = this.props.columns[i];
                if (this.props.hasContextMenu && i == 1)
                    cells.push(react.createElement("div", { className: this.getClassName("header-cell") + " " + this.getClassName("header-cell-menu") }));
                cells.push(this.getHeaderCell(column, null, i == this.props.columns.length - 1));
            }
        }
        return (react.createElement(react.Fragment, null, cells));
    }
    getHeaderCell(column, additionalClass = null, last = false) {
        return react.createElement(TableHeaderCell, { column: column, className: this.props.className, additionalClass: additionalClass, choices: this.getChoices(column), selected: this.getSelected(column), sort: this.props.sort && this.props.sort.field == column.internalName ? this.props.sort.order : null, search: this.getSearch(column), searchApplied: this.isSearchApplied(column), filterApplied: this.isFilterApplied(column), filtersLoaded: this.props.filtersLoaded, onFilterApply: this.onFilterApply, onFilterReset: this.onFilterReset, onSortApply: this.onSortApply, onSearchApply: this.onSearchApply, last: last });
    }
    isFilterApplied(column) {
        return !!this.props.filtering.find(f => f.field == column.internalName);
    }
    isSearchApplied(column) {
        return !!this.props.search.find(s => s.field == column.internalName);
    }
    getSelected(column) {
        return this.getFilterings(this.props.filtering, column);
    }
    getChoices(column) {
        return this.getFilterings(this.props.filterChoices, column);
    }
    getSearch(column) {
        if (!this.props.search)
            return null;
        let search = this.props.search.find(s => s.field == column.internalName);
        return search ? search.text : null;
    }
    getFilterings(list, column) {
        var filter = list.find(f => f.field == column.internalName);
        if (filter)
            return filter.choices;
        return [];
    }
    getClassName(postfix = null) {
        let base = "tv" + (postfix ? "-" + postfix : "");
        return base + (this.props.className ? " " + base + "-" + this.props.className : "");
    }
}
//# sourceMappingURL=TableDefaultHeader.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/table/Table.js




var TableSortType;
(function (TableSortType) {
    TableSortType[TableSortType["asc"] = 0] = "asc";
    TableSortType[TableSortType["desc"] = 1] = "desc";
})(TableSortType || (TableSortType = {}));
class Table extends react.Component {
    constructor(props) {
        super(props);
        this.tableState = 0;
        this.rows = [];
        this.contextMenuCalled = false;
        this.closeContextMenu = () => {
            if (this.contextMenuCalled) {
                this.contextMenuCalled = false;
                return;
            }
            this.rows.forEach(row => row.contextMenuVisible = false);
            this.setState({});
        };
        this.onFilterApply = (field, choices) => {
            let filtering = this.state.filtering;
            let existing = filtering.find(f => f.field == field);
            if (!existing) {
                filtering.push({
                    field,
                    choices
                });
            }
            else
                existing.choices = choices;
            this.tableState = 1;
            this.setState({ filtering });
        };
        this.onFilterReset = (field) => {
            let filtering = this.state.filtering.filter(f => f.field != field);
            this.tableState = 1;
            this.setState({ filtering });
        };
        this.onSortApply = (field, order) => {
            this.tableState = 1;
            this.setState({
                sort: {
                    field,
                    order
                }
            });
        };
        this.onSearchApply = (field, text) => {
            let search = this.state.search;
            if (text != null && typeof (text) != "undefined")
                text = text.trim();
            if (text) {
                let existing = search.find(f => f.field == field);
                if (!existing) {
                    search.push({
                        field,
                        text
                    });
                }
                else
                    existing.text = text;
            }
            else {
                search = search.filter(s => s.field != field);
            }
            this.tableState = 1;
            this.setState({ search });
        };
        this.rowHover = (e, remove = false) => {
            let element = e.currentTarget;
            let className = element.classList.contains("tv-even") ? "tv-even" : "tv-uneven";
            let elements = [element];
            let current = element.nextElementSibling;
            while (current && current.classList.contains(className)) {
                elements.push(current);
                current = current.nextElementSibling;
            }
            current = element.previousElementSibling;
            while (current && current.classList.contains(className)) {
                elements.push(current);
                current = current.previousElementSibling;
            }
            let hoverClass = "tv-row-hover";
            if (this.props.getAdditionalRowClassHover) {
                let id = parseInt(elements[elements.length - 1].querySelector("input[type=hidden]").value);
                let row = this.rows.find(r => r.id == id);
                if (row)
                    hoverClass = this.props.getAdditionalRowClassHover(row);
            }
            for (let element of elements)
                !remove ? element.classList.add(hoverClass) : element.classList.remove(hoverClass);
        };
        this.rows = [];
        this.tableState = this.props.apiUrl ? 1 : 0;
        this.state = {
            filterChoices: [],
            totals: [],
            filtering: [],
            search: [],
            sort: null,
            redirectUrl: null
        };
    }
    render() {
        if (this.props.parent && this.props.parent.state.updateTable) {
            this.tableState = 1;
            this.props.parent.setState({ updateTable: false });
        }
        if (this.props.apiUrl && this.tableState == 1)
            this.getData();
        let css = { gridTemplateColumns: (this.props.getContextMenu ? "auto 7px " : "") + "repeat(" + (this.props.columns.length + (this.props.getContextMenu ? -1 : 0)) + ", auto)" };
        let prealoaderCss = this.getPrealoaderCss();
        this.elementRef = react.createRef();
        let header = [];
        let children = [];
        if (this.props.children) {
            if (Array.isArray(this.props.children))
                children = this.props.children.map(c => c);
            else
                children.push(this.props.children);
            children.forEach(child => {
                if (typeof (child.type) === "string")
                    header.push(child);
                else if (child.type.name == "TableDefaultHeader")
                    header.push(this.getDefaultHeader(child.props));
            });
        }
        else
            header.push(this.getDefaultHeader());
        return (react.createElement("div", { style: css, className: this.getClassName(), ref: this.elementRef },
            this.state.redirectUrl != null ? react.createElement(Redirect, { to: this.state.redirectUrl }) : react.createElement(react.Fragment, null),
            header,
            this.tableState == 1 ?
                react.createElement("div", { className: this.getClassName("loading-cell"), style: prealoaderCss }, "Loading, please wait...") :
                this.rows.map((row, i) => this.getCells(row, i % 2 == 0)),
            this.state.totals.length > 0 ?
                this.getTotals() :
                react.createElement(react.Fragment, null)));
    }
    componentDidMount() {
        document.body.addEventListener("click", this.closeContextMenu);
    }
    componentWillUnmount() {
        document.body.removeEventListener("click", this.closeContextMenu);
    }
    getContextMenu(row) {
        return react.createElement(TableContextMenu, { items: this.props.getContextMenu(row), className: this.props.className, onRedirect: redirectUrl => this.setState({ redirectUrl }) });
    }
    getDefaultHeader(props = null) {
        return react.createElement(TableDefaultHeader, { className: this.props.className, hasContextMenu: !!this.props.getContextMenu, columns: this.props.columns, filtersLoaded: this.tableState == 3, filterChoices: this.state.filterChoices, filtering: this.state.filtering, sort: this.state.sort, search: this.state.search, onFilterApply: this.onFilterApply, onFilterReset: this.onFilterReset, onSortApply: this.onSortApply, onSearchApply: this.onSearchApply }, props && props.children ? props.children : null);
    }
    getTotals() {
        return this.props.columns.map((col, i) => {
            let total = this.state.totals.find(t => t.field == col.internalName);
            let cellClass = col.headerCellClass;
            return react.createElement("div", { className: this.getClassName("total-cell") + (cellClass ? " " + cellClass : "") }, total ? total.total : "");
        });
    }
    getCells(row, even) {
        let cells = [];
        let rowClass = "";
        if (this.props.getAdditionalRowClass)
            rowClass = this.props.getAdditionalRowClass(row);
        this.props.columns.map((col, i) => {
            if (this.props.getContextMenu && i == 1) {
                cells.push(react.createElement("div", { className: this.getClassName("cell-menu") + (even ? " tv-even" : " tv-uneven") + (rowClass ? " " + rowClass : ""), onClick: () => this.callContextMenu(row) },
                    react.createElement("i", { className: "fas fa-ellipsis-v" }),
                    row.contextMenuVisible ? this.getContextMenu(row) : react.createElement(react.Fragment, null)));
            }
            let cellClass = "";
            if (col.getAdditionalCellClass)
                cellClass = col.getAdditionalCellClass(row, col.internalName);
            cells.push(react.createElement("div", { className: this.getClassName("cell") + (even ? " tv-even" : " tv-uneven") + (cellClass ? " " + cellClass : "") + (rowClass ? " " + rowClass : ""), onMouseEnter: e => this.rowHover(e), onMouseLeave: e => this.rowHover(e, true), onClick: col.onClick ? () => col.onClick(row) : null, onDoubleClick: col.onDoubleClick ? () => col.onDoubleClick(row) : null },
                i == 0 ? react.createElement("input", { type: "hidden", value: row.id }) : react.createElement(react.Fragment, null),
                col.map ? col.map(row) : row[col.internalName]));
        });
        return cells;
    }
    callContextMenu(row) {
        this.rows.forEach(row => row.contextMenuVisible = false);
        row.contextMenuVisible = true;
        this.contextMenuCalled = true;
        this.setState({});
    }
    getPrealoaderCss() {
        let preloaderCss = {};
        preloaderCss.gridColumn = "span " + (this.props.columns.length + (this.props.getContextMenu ? 1 : 0));
        if (this.tableState == 1 && this.elementRef && this.elementRef.current.children.length > 2) {
            let cells = this.elementRef.current.children;
            let first = cells[0];
            let last = cells[cells.length - 1];
            preloaderCss.height = (last.offsetTop + last.offsetHeight) - (first.offsetTop + first.offsetHeight) + "px";
        }
        return preloaderCss;
    }
    onDataLoaded(res) {
        if (this.props.onDataLoaded)
            this.props.onDataLoaded(res);
        let data = res.data;
        this.tableState = 2;
        this.rows = data.rows;
        if (this.props.parent) {
            this.props.parent.setState({
                totalRows: data.totalRows,
                rowsPerPage: data.rowsPerPage
            });
        }
        if (data.totalRows > 0 && data.rows.length == 0) {
            let pagesCount = ~~(data.totalRows / data.rowsPerPage) + (data.totalRows % data.rowsPerPage > 0 ? 1 : 0);
            if (this.props.parent) {
                this.props.parent.setState({
                    page: pagesCount,
                    updateTable: true
                });
            }
        }
        else if (this.tableState != 3) {
            let needFilterings = this.props.columns.filter(c => c.filterable).length > 0;
            let needTotals = this.props.columns.filter(c => c.hasTotal).length > 0;
            let filteringsResult = [];
            let totalsResult = [];
            let count = (needFilterings ? 1 : 0) + (needTotals ? 1 : 0);
            let counter = 0;
            let handleResult = () => {
                if (++counter == count) {
                    this.setState({
                        filterChoices: filteringsResult,
                        totals: totalsResult
                    });
                }
            };
            if (needFilterings) {
                let filteringsPromise = fetch(this.getUrl(this.props.apiUrl + "/filterings")).then(r => r.json());
                filteringsPromise.then(res => {
                    let filterChoices = res.data;
                    filterChoices.forEach(filtering => filtering.choices = filtering.choices.map(c => c != null && typeof (c) !== "undefined" ? c.toString() : ""));
                    filteringsResult = filterChoices;
                    handleResult();
                });
            }
            if (needTotals) {
                let totalsPromise = fetch(this.getUrl(this.props.apiUrl + "/totals")).then(r => r.json());
                totalsPromise.then(res => {
                    let totals = res.data;
                    totalsResult = totals;
                    handleResult();
                });
            }
        }
    }
    getData() {
        fetch(this.getUrl(this.props.apiUrl))
            .then(r => r.json())
            .then(data => this.onDataLoaded(data))
            .catch(e => console.error(e));
    }
    getUrl(base) {
        let add = [];
        if (this.state.filtering)
            add.push("filtering=" + encodeURIComponent(JSON.stringify(this.state.filtering)));
        if (this.state.sort)
            add.push("sort=" + encodeURIComponent(JSON.stringify(this.state.sort)));
        if (this.state.search)
            add.push("search=" + encodeURIComponent(JSON.stringify(this.state.search)));
        if (this.props.parent && this.props.parent.state.search)
            add.push("searchEverywhere=" + encodeURIComponent(this.props.parent.state.search));
        if (this.props.parent && this.props.parent.state.page)
            add.push("page=" + encodeURIComponent(this.props.parent.state.page));
        if (this.props.parent) {
            let query = this.props.parent.state.query;
            for (let key of query.keys()) {
                query.get(key).forEach(v => add.push(key + "=" + encodeURIComponent(v)));
            }
        }
        if (add.length > 0)
            base += (base.indexOf("?") == -1 ? "?" : "&") + add.join("&");
        return base;
    }
    getClassName(postfix = null) {
        let base = "tv" + (postfix ? "-" + postfix : "");
        return base + (this.props.className ? " " + base + "-" + this.props.className : "");
    }
}
//# sourceMappingURL=Table.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/table/TableContainer.js

class TableContainer extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageTitle: "",
            search: "",
            updateTable: true,
            query: new Map(),
            rowsPerPage: null,
            totalRows: null,
            page: 1
        };
    }
    componentDidMount() {
        document.title = this.state.pageTitle;
        this.props.app.header.setState({ pageTitle: this.state.pageTitle });
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !this.state.updateTable || nextState.updateTable;
    }
}
//# sourceMappingURL=TableContainer.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/table/TableInfo.js

class TableInfo extends react.Component {
    render() {
        let from = (this.props.page - 1) * this.props.rowsPerPage + 1;
        let to = from + this.props.rowsPerPage - 1;
        if (to > this.props.totalRows)
            to = this.props.totalRows;
        return (react.createElement("div", null,
            "Showing ",
            from,
            " to ",
            to,
            " of ",
            this.props.totalRows,
            " rows"));
    }
}
//# sourceMappingURL=TableInfo.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/table/TablePaginator.js

class TablePaginator extends react.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var pages = this.getPages();
        return (pages.length > 1 ?
            this.props.totalRows != null ?
                react.createElement("div", { className: "paginator" },
                    react.createElement("div", { className: "paginator-item left", onClick: () => this.decrement() }, "<"),
                    pages.map(p => react.createElement("div", { className: "paginator-item" + (p == -1 ? " empty" : "") + (p == this.props.page ? " selected" : ""), onClick: () => this.onClick(p) }, p != -1 ? p : "...")),
                    react.createElement("div", { className: "paginator-item right", onClick: () => this.increment() }, ">")) :
                react.createElement(react.Fragment, null) :
            react.createElement(react.Fragment, null));
    }
    decrement() {
        let page = this.props.page - 1;
        if (page < 1)
            page = this.pagesCount;
        if (this.props.onChange)
            this.props.onChange(page);
    }
    increment() {
        let page = this.props.page + 1;
        if (page > this.pagesCount)
            page = 1;
        if (this.props.onChange)
            this.props.onChange(page);
    }
    onClick(page) {
        if (page == -1 || this.props.page == page)
            return;
        if (this.props.onChange)
            this.props.onChange(page);
    }
    getPages() {
        this.pagesCount = ~~(this.props.totalRows / this.props.rowsPerPage) + (this.props.totalRows % this.props.rowsPerPage > 0 ? 1 : 0);
        var pages = [];
        if (this.pagesCount <= 7) {
            for (var i = 1; i <= this.pagesCount; i++)
                pages.push(i);
        }
        else {
            if (this.props.page <= 4) {
                for (var i = 1; i <= 5; i++)
                    pages.push(i);
                pages.push(-1);
                pages.push(this.pagesCount);
            }
            else if (this.props.page > this.pagesCount - 4) {
                pages.push(1);
                pages.push(-1);
                for (var i = this.pagesCount - 4; i <= this.pagesCount; i++)
                    pages.push(i);
            }
            else {
                pages.push(1);
                pages.push(-1);
                pages.push(this.props.page - 1);
                pages.push(this.props.page);
                pages.push(this.props.page + 1);
                pages.push(-1);
                pages.push(this.pagesCount);
            }
        }
        return pages;
    }
}
//# sourceMappingURL=TablePaginator.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/table/TableSearch.js

class TableSearch extends react.Component {
    constructor(props) {
        super(props);
        this.timeout = 500;
        this.state = {
            value: this.props.value ? this.props.value : ""
        };
    }
    render() {
        return (react.createElement("input", { type: "text", placeholder: "Try searching here...", onChange: e => this.setValue(e), value: this.state.value }));
    }
    setValue(e) {
        this.setState({
            value: e.currentTarget.value
        });
        let now = new Date();
        setTimeout((date) => {
            if (this.lastChangeDate.getTime() == date.getTime()) {
                this.props.parent.setState({
                    search: this.state.value,
                    updateTable: true
                });
            }
        }, this.timeout, now);
        this.lastChangeDate = now;
    }
}
//# sourceMappingURL=TableSearch.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/pages/AccessDenied.js

class AccessDenied extends react.Component {
    render() {
        return react.createElement("div", { className: "access-denied" }, "Access to this page is denied");
    }
}
//# sourceMappingURL=AccessDenied.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/pages/Footer.js

class Footer extends react.Component {
    render() {
        return react.createElement("footer", null,
            "\u00A9 2020-",
            new Date().getFullYear(),
            " - A1 Data Management Solutions");
    }
}
//# sourceMappingURL=Footer.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/pages/Header.js


class Header extends react.Component {
    constructor(props) {
        super(props);
        props.app.header = this;
        this.state = {
            pageTitle: "",
            userName: ""
        };
    }
    render() {
        return (react.createElement("header", null,
            react.createElement("span", { className: "header-left-label" }, this.state.pageTitle),
            react.createElement("ul", { className: "header-menu-items" }, this.props.menuItems.map(item => react.createElement(Link, { to: item.link },
                react.createElement("li", { className: "header-menu-item" + (!item.children || item.children.length == 0 ? " pointer" : "") },
                    react.createElement("span", null, item.label),
                    item.children && item.children.length > 0 &&
                        react.createElement("ul", { className: "header-submenu-items" }, item.children.map(child => react.createElement(Link, { to: child.link },
                            react.createElement("li", { className: "header-submenu-item" }, child.label)))))))),
            react.createElement("span", { className: "header-logout" },
                this.state.userName,
                react.createElement("a", { href: "/v2/mgmt/auth?hadler=logout" },
                    react.createElement("i", { className: "fa fa-sign-out", "aria-hidden": "true" })))));
    }
    componentDidMount() {
        if (this.props.app.currentUserPromise) {
            this.props.app.currentUserPromise.then(user => {
                this.setState({ userName: user.name });
            });
        }
    }
}
//# sourceMappingURL=Header.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/pages/NotFound.js

class NotFound extends react.Component {
    render() {
        return react.createElement("div", { className: "not-found" }, "Page not found");
    }
}
//# sourceMappingURL=NotFound.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/pages/Main.js




class Main extends react.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (react.createElement("main", null,
            react.createElement(Switch, null,
                this.props.routes.map(route => react.createElement(Route, { path: route.path, exact: route.exact }, route.component)),
                react.createElement(Route, { path: this.props.app.accessDeniedUrl, exact: true, component: AccessDenied }),
                react.createElement(Route, { component: NotFound }))));
    }
}
//# sourceMappingURL=Main.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/pages/ManagementApp.js










class ManagementApp extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false
        };
    }
    render() {
        return (react.createElement(BrowserRouter, null,
            react.createElement("div", { className: "wrapper" },
                react.createElement(Modal, { loading: true, visible: this.state.loading }),
                react.createElement(ModalError, { errors: [Form.unknownError], visible: this.state.error }),
                this.state.loading ?
                    react.createElement(react.Fragment, null, this.props.app.fetch.map(p => react.createElement(FetchData, { url: p.url, obj: this.props.app, prop: p.prop, map: p.map, after: p.after }))) :
                    react.createElement(react.Fragment, null,
                        react.createElement(Notification, { app: this.props.app }),
                        react.createElement(Header, { app: this.props.app, menuItems: this.props.app.getMenu() }),
                        react.createElement(Main, { app: this.props.app, routes: this.props.app.routes }),
                        react.createElement(Footer, null)))));
    }
    componentDidMount() {
        let promises = this.props.app.fetch.map(f => this.props.app[f.prop]);
        Promise.all(promises)
            .then(() => this.setState({ loading: false }))
            .catch(() => this.setState({ error: true }));
    }
}
//# sourceMappingURL=ManagementApp.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/helpers/Map.js
class KeyValuePair {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
class map {
    static mapToArray(map) {
        let list = [];
        map.forEach((value, key) => list.push(new KeyValuePair(key, value)));
        return list;
    }
    static arrayToMap(array) {
        let map = new Map();
        array.forEach(a => map.set(a.key, a.value));
        return map;
    }
}
//# sourceMappingURL=Map.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/helpers/Http.js

var HttpMethod;
(function (HttpMethod) {
    HttpMethod[HttpMethod["get"] = 0] = "get";
    HttpMethod[HttpMethod["post"] = 1] = "post";
    HttpMethod[HttpMethod["put"] = 2] = "put";
    HttpMethod[HttpMethod["delete"] = 3] = "delete";
})(HttpMethod || (HttpMethod = {}));
class http {
    static fetch(url, method = HttpMethod.get, body = null) {
        let request = null;
        if (method != HttpMethod.get) {
            request = {
                method: HttpMethod[method],
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            };
            if (body) {
                let params = [];
                for (let kvp of map.mapToArray(body)) {
                    if (typeof (kvp.value) == "string")
                        params.push(kvp.key + "=" + encodeURIComponent(kvp.value));
                    else {
                        for (let value of kvp.value) {
                            params.push(kvp.key + "=" + encodeURIComponent(value));
                        }
                    }
                }
                request.body = params.join("&");
            }
        }
        return fetch(url, request).then((res) => res.ok ? res.json() : new Error());
    }
}
//# sourceMappingURL=Http.js.map
;// CONCATENATED MODULE: ./node_modules/a1dms-front/js/index.js

































//# sourceMappingURL=index.js.map
;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/users/Users.tsx




var UserRole;
(function (UserRole) {
    UserRole[UserRole["administrator"] = 1] = "administrator";
    UserRole[UserRole["siteAdministrator"] = 2] = "siteAdministrator";
    UserRole[UserRole["supervisor"] = 4] = "supervisor";
    UserRole[UserRole["SSHEUser"] = 8] = "SSHEUser";
    UserRole[UserRole["votingUser"] = 16] = "votingUser";
})(UserRole || (UserRole = {}));
class UserService {
    static hasRole(role) {
        let roles = (Array.isArray(app.currentUser.role) ? app.currentUser.role : [app.currentUser.role]).reduce((n1, n2) => n1 | n2);
        return (roles & role) != 0;
    }
    static correspondsPolicy(policyName) {
        let policy = app.accessPolicies.get(policyName);
        if (policy == null)
            throw new Error("Policy '" + policyName + "' not found");
        return policy();
    }
}
class Users extends TableContainer {
    constructor(props) {
        super(props);
        this.getContextMenu = (row) => {
            return [
                {
                    label: "Edit",
                    icon: react.createElement("i", { className: "fas fa-info-circle" }),
                    route: "/v2/mgmt/users/edit/" + row.id
                },
                {
                    label: "Delete",
                    icon: react.createElement("i", { className: "fas fa-edit" }),
                    action: () => this.delete(row)
                }
            ];
        };
        let state = this.state;
        state.pageTitle = "Users";
        state.loading = false;
        state.errors = [];
    }
    render() {
        return (react.createElement(react.Fragment, null,
            react.createElement(Access, { app: app, policy: "administrator" }),
            react.createElement(Modal, { loading: true, visible: this.state.loading }),
            react.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backUrl: "/v2/mgmt/users", backLabel: "Back to Users" }),
            react.createElement("div", { className: "users-container" },
                react.createElement("div", { className: "report-search-area" },
                    react.createElement("div", { className: "report-search-left" },
                        react.createElement(Link, { to: "/v2/mgmt/users/new" }, "Create New")),
                    react.createElement("div", { className: "report-search-space" }),
                    react.createElement("div", { className: "report-search-right" },
                        react.createElement(TableSearch, { parent: this })),
                    react.createElement("div", { className: "report-search-right" },
                        react.createElement("button", { className: "tv-button", onClick: () => location.href = "/api/users/export" },
                            react.createElement("i", { className: "fa fa-table", "aria-hidden": "true" })))),
                react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                    react.createElement("div", { className: "pagination-info" },
                        react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                    react.createElement("div", null,
                        react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
                react.createElement(Table, { parent: this, apiUrl: "/api/users", columns: this.getColumns(), className: "users", getContextMenu: this.getContextMenu }),
                react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                    react.createElement("div", { className: "pagination-info" },
                        react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                    react.createElement("div", null,
                        react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))))));
    }
    changePage(page) {
        this.setState({
            page,
            updateTable: true
        });
    }
    delete(row) {
        if (confirm("Do you want to delete this user?")) {
            this.setState({ loading: true });
            Form.sendRequest("DELETE", "/api/users/" + row.id).then(res => this.onDeleted(res), () => this.setState({
                errors: [Form.unknownError],
                loading: false
            }));
        }
    }
    onDeleted(res) {
        if (res.status == "ok")
            app.notification.show(react.createElement("div", null,
                "User ",
                res.data.name,
                " successfully deleted"));
        this.setState({
            updateTable: true,
            errors: res.status == "error" ? res.errors.map(error => error.text) : [],
            loading: false
        });
    }
    getColumns() {
        let getColumn = (label, internalName = null, sortable = false, filterable = false, searchable = false, map = null) => {
            if (!internalName)
                internalName = label;
            return {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map
            };
        };
        let convertId = (row) => react.createElement(react.Fragment, null,
            react.createElement(Link, { to: "/v2/mgmt/users/edit/" + row.id }, "edit"),
            " | ",
            react.createElement("span", { className: "a", onClick: () => this.delete(row) }, "delete"));
        return [
            getColumn("Name", "name", true, true, true),
            getColumn("Logon Name", "logonName", true, true, true),
            getColumn("EMail", "eMail", true, true, true),
            getColumn("Role", "role", false, true),
            getColumn("Company", "company", true, true, true),
            getColumn("Sites", "sites", false, true),
            getColumn("Created by", "createdBy", true, true, true),
            getColumn("", "id", false, false, false, convertId)
        ];
    }
}

// EXTERNAL MODULE: ./node_modules/react-switch/index.js
var react_switch = __webpack_require__(936);
;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/CardDetails.tsx


var Language;
(function (Language) {
    Language[Language["eng"] = 0] = "eng";
    Language[Language["rus"] = 1] = "rus";
})(Language || (Language = {}));
class CardDetails extends react.Component {
    constructor(props) {
        super(props);
        this.state = { lang: Language.eng };
    }
    render() {
        return (react.createElement("div", { className: "card-details" },
            react.createElement("div", null,
                react.createElement("div", { className: "card-details-label" }, "Name"),
                react.createElement("div", null, this.getDisplayName())),
            react.createElement("div", null,
                react.createElement("div", { className: "card-details-label" }, "Toggle Language"),
                react.createElement("div", null,
                    react.createElement(react_switch.default, { onChange: () => this.toggleLang(), checked: this.state.lang == Language.rus, uncheckedIcon: react.createElement("div", { className: "switch-label" }, "eng"), checkedIcon: react.createElement("div", { className: "switch-label" }, "rus"), height: 25, width: 60 }))),
            react.createElement("div", null),
            react.createElement("div", null,
                react.createElement("div", { className: "card-details-label" }, "Site"),
                react.createElement("div", null, this.props.card.site)),
            react.createElement("div", null,
                react.createElement("div", { className: "card-details-label" }, "Company"),
                react.createElement("div", null, this.props.card.company)),
            react.createElement("div", null,
                react.createElement("div", { className: "card-details-label" }, "Department"),
                react.createElement("div", null, this.props.card.department)),
            react.createElement("div", { className: "card-details-span3" },
                react.createElement("div", { className: "card-details-label" }, "Description"),
                react.createElement("div", null, this.state.lang == Language.eng ? this.props.card.description : this.props.card.descriptionRus)),
            react.createElement("div", { className: "card-details-span3" },
                react.createElement("div", { className: "card-details-label" }, "Actions Taken"),
                react.createElement("div", null, this.state.lang == Language.eng ? this.props.card.actionsTaken : this.props.card.actionsTakenRus)),
            react.createElement("div", { className: "card-details-span3" },
                react.createElement("div", { className: "card-details-label" }, "Actions Suggested"),
                react.createElement("div", null, this.state.lang == Language.eng ? this.props.card.furtherActions : this.props.card.furtherActionsRus))));
    }
    toggleLang() {
        this.setState({ lang: this.state.lang == Language.eng ? Language.rus : Language.eng });
    }
    getDisplayName() {
        return (this.props.card.lastName ? this.props.card.lastName : "") +
            (this.props.card.firstName && this.props.card.firstName ? ", " : "") +
            (this.props.card.firstName ? this.props.card.firstName : "");
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/Cards.tsx






class Cards extends TableContainer {
    constructor(props) {
        super(props);
        this.getContextMenu = (row) => {
            return [
                {
                    label: "Nominate",
                    icon: react.createElement("i", { className: "fas fa-vote-yea" }),
                    action: () => this.showNominationSelector(row)
                },
                {
                    label: "Details",
                    icon: react.createElement("i", { className: "fas fa-info-circle" }),
                    action: () => this.showDetails(row)
                },
                {
                    label: "Edit",
                    icon: react.createElement("i", { className: "fas fa-edit" }),
                    action: () => location.href = "/index?id=" + row.id
                }
            ];
        };
        let state = this.state;
        state.showDatePicker = false;
        state.dateFrom = DateRangePicker.getRange("cm")[0];
        state.pageTitle = "NGH Cards";
        state.detailsVisible = false;
        state.detailsLoading = false;
        state.nominationSelectorVisible = false;
        state.nominationLoading = false;
        state.errorVisible = false;
        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }
    render() {
        return (react.createElement("div", null,
            react.createElement(Modal, { header: "Select range", height: 270, visible: this.state.showDatePicker, onClose: () => this.setState({ showDatePicker: false }) },
                react.createElement(DateRangePicker, { onChange: (from, to) => this.dateRangeSelected(from, to) })),
            react.createElement(Modal, { visible: this.state.detailsVisible, loading: this.state.detailsLoading, width: 900, onClose: () => this.setState({ detailsVisible: false }) },
                react.createElement(CardDetails, { card: this.state.details })),
            react.createElement(Modal, { visible: this.state.nominationSelectorVisible, loading: this.state.nominationLoading, width: 400, height: 240, header: "Select category", onClose: () => this.setState({ nominationSelectorVisible: false }) },
                react.createElement(Select, { options: app.nominationCategories, onChange: values => this.categorySelected(values[0]), dropdownWidth: "500px", values: this.state.nominationCategory ? [this.state.nominationCategory] : null })),
            react.createElement(ModalError, { visible: this.state.errorVisible, errors: [this.state.errorMessage], onClose: () => this.setState({ errorVisible: false }) }),
            react.createElement("div", { className: "report-search-area" },
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.sites.map(s => s.text), multiple: true, placeholder: "Select sites...", width: 200, onChange: v => this.onFieldValueChanged("sites", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.companies.map(s => s.text), multiple: true, placeholder: "Select companies...", width: 200, onChange: v => this.onFieldValueChanged("companies", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.departments.map(s => s.text), multiple: true, placeholder: "Select departments...", width: 200, onChange: v => this.onFieldValueChanged("departments", v) })),
                react.createElement("div", { className: "report-search-left nopadding" },
                    react.createElement("input", { type: "date", placeholder: "From...", value: this.state.dateFrom, onChange: e => this.onDateChanged(e.currentTarget.value, "from") }),
                    "\u00A0-\u00A0",
                    react.createElement("input", { type: "date", placeholder: "To...", value: this.state.dateTo, onChange: e => this.onDateChanged(e.currentTarget.value, "to") }),
                    " \u00A0"),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement("button", { className: "date-picker-button", onClick: () => this.setState({ showDatePicker: true }) }, "...")),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement("button", { onClick: () => this.getReport() }, "Get Report")),
                react.createElement("div", { className: "report-search-space" }),
                react.createElement("div", { className: "report-search-right" },
                    react.createElement(TableSearch, { parent: this }))),
            react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                react.createElement("div", { className: "pagination-info" },
                    react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                react.createElement("div", null,
                    react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
            react.createElement(Table, { parent: this, className: "cards", apiUrl: "/api/cards", columns: this.getColumns(), getContextMenu: this.getContextMenu },
                react.createElement("div", { className: "cards-top-cell" },
                    react.createElement(react_switch.default, { onChange: () => this.toggleLang(), checked: this.state.lang == Language.rus, uncheckedIcon: react.createElement("div", { className: "switch-label" }, "eng"), checkedIcon: react.createElement("div", { className: "switch-label" }, "rus"), height: 25, width: 60 })),
                react.createElement(TableDefaultHeader, null)),
            react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                react.createElement("div", { className: "pagination-info" },
                    react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                react.createElement("div", null,
                    react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) })))));
    }
    categorySelected(category) {
        this.setState({ nominationLoading: true });
        let handleError = (error = null) => {
            this.setState({
                nominationLoading: false,
                nominationSelectorVisible: false,
                errorVisible: true,
                errorMessage: error ? error : Form.unknownError
            });
        };
        let body = new Map();
        body.set("cardId", this.state.nominationCardId.toString());
        body.set("category", category);
        http.fetch("/api/nominations", HttpMethod.post, body)
            .then(res => {
            if (res.status == "ok") {
                this.setState({
                    nominationLoading: false,
                    nominationSelectorVisible: false,
                    updateTable: true
                });
            }
            else
                handleError(res.errors[0].text);
        })
            .catch(() => handleError());
    }
    showDetails(row) {
        this.setState({
            detailsLoading: true,
            detailsVisible: true
        });
        let handleError = () => {
            this.setState({
                detailsLoading: false,
                detailsVisible: false,
                errorVisible: true,
                errorMessage: "Failed to retrieve card data"
            });
        };
        http.fetch("/api/cards/" + row.id)
            .then(res => {
            if (res.status == "ok") {
                this.setState({
                    detailsLoading: false,
                    details: res.data
                });
            }
            else
                handleError();
        })
            .catch(() => handleError());
    }
    showNominationSelector(row) {
        this.setState({
            nominationSelectorVisible: true,
            nominationLoading: true,
            nominationCardId: row.id,
            nominationCategory: row.nominationCategory
        });
        let handleError = (error = null) => {
            this.setState({
                nominationLoading: false,
                nominationSelectorVisible: false,
                errorVisible: true,
                errorMessage: error ? error : Form.unknownError
            });
        };
        fetch("/api/nominations/allowed/" + row.id)
            .then(res => res.ok ? res.json() : new Error())
            .then((res) => {
            if (res.status == "ok")
                this.setState({ nominationLoading: false });
            else
                handleError(res.errors[0].text);
        })
            .catch(() => handleError());
    }
    toggleLang() {
        let lang = Language.rus;
        if (this.state.lang == Language.rus)
            lang = Language.eng;
        this.setState({ lang });
    }
    changePage(page) {
        this.setState({
            page,
            updateTable: true
        });
    }
    getReport() {
        this.setState({
            updateTable: true,
            query: this.state.query
        });
    }
    onDateChanged(value, field) {
        if (field == "from")
            this.setState({ dateFrom: value });
        else if (field == "to")
            this.setState({ dateTo: value });
        this.onFieldValueChanged(field, [value]);
    }
    onFieldValueChanged(field, values) {
        this.state.query.set(field, values);
    }
    dateRangeSelected(from, to) {
        this.onFieldValueChanged("from", [from]);
        if (to)
            this.onFieldValueChanged("to", [to]);
        this.setState({
            dateFrom: from,
            dateTo: to,
            showDatePicker: false
        });
    }
    getColumns() {
        let getColumn = (label, internalName = null, sortable = false, filterable = false, searchable = false, map = null) => {
            if (!internalName)
                internalName = label;
            return {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map,
                onDoubleClick: row => this.showDetails(row)
            };
        };
        let convertStringList = (items) => {
            let list = [];
            for (let i = 0; i < items.length; i++) {
                list.push(react.createElement(react.Fragment, null,
                    items[i],
                    ";"));
                if (i != items.length - 1)
                    list.push(react.createElement("br", null));
            }
            return list;
        };
        let getStringByLang = (text, lang) => react.createElement(react.Fragment, null, text ? text.split("{-DELIM-}")[lang == Language.rus ? 1 : 0] : "");
        let getAdditionalCellClass = (row) => row.nominationCategory || row.nominatedBy ? "tv-cell-nominated-card" : "";
        let nomination = getColumn("Nomination", "nominationCategory", true, true, true);
        nomination.getAdditionalCellClass = getAdditionalCellClass;
        nomination.onDoubleClick = row => this.showNominationSelector(row);
        let nominatedBy = getColumn("Nominated by", "nominatedBy", true, true, true);
        nominatedBy.getAdditionalCellClass = getAdditionalCellClass;
        nominatedBy.onDoubleClick = row => this.showNominationSelector(row);
        return [
            getColumn("Card #", "id", true, false, true),
            getColumn("Date", "date", true, true, false, row => react.createElement("span", null, utility.convertDate(row.date, true))),
            getColumn("Site", "site", true, true, true),
            getColumn("Company", "company", true, true, true),
            getColumn("Department", "department", true, true, true),
            getColumn("Name", "employee", true, false, true),
            getColumn("Report Type", "reportType", true, true, true),
            getColumn("Life Saving Actions", "lifeSavingActions", true, true, true),
            getColumn("Categories", "hazardID", false, true, true, row => convertStringList(row.hazardID)),
            getColumn("Safe Choice Categories", "safeChoice", false, true, true, row => convertStringList(row.safeChoice)),
            getColumn("Description", "description", false, false, true, row => getStringByLang(row.description, this.state.lang)),
            getColumn("Actions Taken", "actionsTaken", false, false, true, row => getStringByLang(row.actionsTaken, this.state.lang)),
            getColumn("Location", "location", false, false, true, row => getStringByLang(row.location, this.state.lang)),
            getColumn("Suggested Actions", "furtherActions", false, false, true, row => getStringByLang(row.furtherActions, this.state.lang)),
            nomination,
            nominatedBy
        ];
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/sites/Sites.tsx




class Sites extends TableContainer {
    constructor(props) {
        super(props);
        this.getContextMenu = (row) => {
            return [
                {
                    label: "Edit",
                    icon: react.createElement("i", { className: "fas fa-info-circle" }),
                    route: "/v2/mgmt/sites/edit/" + row.id
                },
                {
                    label: "Delete",
                    icon: react.createElement("i", { className: "fas fa-edit" }),
                    action: () => this.delete(row)
                }
            ];
        };
        let state = this.state;
        state.pageTitle = "Sites";
        state.loading = false;
        state.errors = [];
    }
    render() {
        return (react.createElement(react.Fragment, null,
            react.createElement(Access, { app: app, policy: "administrator" }),
            react.createElement(Modal, { loading: true, visible: this.state.loading }),
            react.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backUrl: "/v2/mgmt/sites", backLabel: "Back to Sites" }),
            react.createElement("div", { className: "small-container" },
                react.createElement("div", { className: "report-search-area" },
                    react.createElement("div", { className: "report-search-left" },
                        react.createElement(Link, { to: "/v2/mgmt/sites/new" }, "Create New")),
                    react.createElement("div", { className: "report-search-space" }),
                    react.createElement("div", { className: "report-search-right" },
                        react.createElement(TableSearch, { parent: this })),
                    react.createElement("div", { className: "report-search-right" },
                        react.createElement("button", { className: "tv-button", onClick: () => location.href = "/api/sites/export" },
                            react.createElement("i", { className: "fa fa-table", "aria-hidden": "true" })))),
                react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                    react.createElement("div", { className: "pagination-info" },
                        react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                    react.createElement("div", null,
                        react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
                react.createElement(Table, { parent: this, apiUrl: "/api/sites", columns: this.getColumns(), className: "small", getContextMenu: this.getContextMenu }),
                react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                    react.createElement("div", { className: "pagination-info" },
                        react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                    react.createElement("div", null,
                        react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))))));
    }
    changePage(page) {
        this.setState({
            page,
            updateTable: true
        });
    }
    delete(row) {
        if (confirm("Do you want to delete this site?")) {
            this.setState({ loading: true });
            Form.sendRequest("DELETE", "/api/sites/" + row.id).then(res => this.onDeleted(res), () => this.setState({
                errors: [Form.unknownError],
                loading: false
            }));
        }
    }
    onDeleted(res) {
        if (res.status == "ok")
            app.notification.show(react.createElement("div", null,
                "Site ",
                res.data.name,
                " successfully deleted"));
        this.setState({
            updateTable: true,
            errors: res.status == "error" ? res.errors.map(error => error.text) : [],
            loading: false
        });
    }
    getColumns() {
        let getColumn = (label, internalName = null, sortable = false, filterable = false, searchable = false, map = null) => {
            if (!internalName)
                internalName = label;
            return {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map
            };
        };
        let convertInactive = (row) => react.createElement("input", { type: "checkbox", disabled: true, checked: row.inactive });
        let convertId = (row) => react.createElement(react.Fragment, null,
            react.createElement(Link, { to: "/v2/mgmt/sites/edit/" + row.id }, "edit"),
            " | ",
            react.createElement("span", { className: "a", onClick: () => this.delete(row) }, "delete"));
        return [
            getColumn("Name", "name", true, true, true),
            getColumn("Inactive", "inactive", false, true, false, convertInactive),
            getColumn("", "id", false, false, false, convertId)
        ];
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/sites/SitesForm.tsx




class SitesForm extends react.Component {
    constructor(props) {
        super(props);
        this.valueSet = false;
        this.fields = this.getFields();
        this.state = {
            redirect: false,
            loading: false
        };
    }
    render() {
        if (this.props.value && !this.valueSet) {
            for (let field of this.fields)
                field.value = this.props.value[field.name];
            this.valueSet = true;
        }
        let submit = { value: this.props.submitLabel };
        let name = this.retrieve("name");
        let inactive = this.retrieve("inactive");
        return (react.createElement(react.Fragment, null,
            react.createElement(Access, { app: app, policy: "administrator" }),
            this.state.redirect ? react.createElement(Redirect, { to: this.props.redirectUrl }) : react.createElement(react.Fragment, null),
            react.createElement(Modal, { loading: true, visible: this.state.loading }),
            react.createElement(Form, { method: this.props.method, url: this.props.url, fields: this.fields, className: "form", send: () => this.setState({ loading: true }), success: res => this.handleSuccess(res), error: () => this.setState({ loading: false }) },
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: name })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: name })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: name }))),
                react.createElement("div", { className: "field" },
                    react.createElement(FormField, { field: inactive }),
                    " ",
                    react.createElement(FormFieldLabel, { field: inactive })),
                react.createElement("div", { className: "submit" },
                    react.createElement(FormSubmit, { submit: submit })),
                react.createElement("div", { className: "form-error" },
                    react.createElement(FormError, null)),
                react.createElement(Link, { className: "form-back-link", to: "/v2/mgmt/sites" }, "Back to Sites"))));
    }
    handleSuccess(res) {
        app.notification.show(react.createElement("div", null,
            "Site ",
            react.createElement(Link, { to: "/v2/mgmt/sites/edit/" + res.data.id }, res.data.name),
            " successfully ",
            this.props.formType == FormType.new ? "created" : "updated"));
        this.setState({
            loading: false,
            redirect: true
        });
    }
    retrieve(name) {
        return this.fields.find(f => f.name == name);
    }
    getFields() {
        return [
            {
                displayName: "Name",
                name: "name",
                required: true,
                type: FormFieldType.singleline,
                validate: value => [!!(typeof (value) != "undefined" && value != null ? value.trim() : null), null]
            },
            {
                id: "inactive",
                displayName: "Inactive",
                name: "inactive",
                type: FormFieldType.checkbox
            },
        ];
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/sites/SitesEditForm.tsx



class SitesEditForm extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            errors: []
        };
    }
    render() {
        return (react.createElement(react.Fragment, null,
            this.state.value == null ? react.createElement(FetchData, { obj: this, prop: "site", url: "/api/sites/" + this.props.match.params.id }) : react.createElement(react.Fragment, null),
            react.createElement(Modal, { loading: true, visible: this.state.value == null }),
            react.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backLabel: "Back to Sites", backUrl: "/v2/mgmt/sites" }),
            react.createElement(SitesForm, { formType: FormType.edit, submitLabel: "Save", value: this.state.value, method: "PUT", url: "/api/sites/" + this.props.match.params.id, redirectUrl: "/v2/mgmt/sites" })));
    }
    componentDidMount() {
        if (this.site) {
            this.site
                .then(res => {
                if (res.status == "ok")
                    this.setState({ value: res.data });
                else
                    this.setState({ errors: res.errors.map(e => e.text) });
            }, error => this.setState({ errors: [Form.unknownErrorWithRefresh] }))
                .catch(error => this.setState({ errors: [Form.unknownErrorWithRefresh] }));
        }
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/sites/SitesNewForm.tsx



class SitesNewForm extends react.Component {
    render() {
        return (react.createElement(SitesForm, { formType: FormType.new, submitLabel: "Create", method: "POST", url: "/api/sites", redirectUrl: "/v2/mgmt/sites" }));
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/departments/Departments.tsx




class Departments extends TableContainer {
    constructor(props) {
        super(props);
        this.getContextMenu = (row) => {
            return [
                {
                    label: "Edit",
                    icon: react.createElement("i", { className: "fas fa-info-circle" }),
                    route: "/v2/mgmt/department/edit/" + row.id
                },
                {
                    label: "Delete",
                    icon: react.createElement("i", { className: "fas fa-edit" }),
                    action: () => this.delete(row)
                }
            ];
        };
        let state = this.state;
        state.pageTitle = "Departments";
        state.loading = false;
        state.errors = [];
    }
    render() {
        return (react.createElement(react.Fragment, null,
            react.createElement(Access, { app: app, policy: "administrator" }),
            react.createElement(Modal, { loading: true, visible: this.state.loading }),
            react.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backUrl: "/v2/mgmt/departments", backLabel: "Back to Departments" }),
            react.createElement("div", { className: "small-container" },
                react.createElement("div", { className: "report-search-area" },
                    react.createElement("div", { className: "report-search-left" },
                        react.createElement(Link, { to: "/v2/mgmt/departments/new" }, "Create New")),
                    react.createElement("div", { className: "report-search-space" }),
                    react.createElement("div", { className: "report-search-right" },
                        react.createElement(TableSearch, { parent: this })),
                    react.createElement("div", { className: "report-search-right" },
                        react.createElement("button", { className: "tv-button", onClick: () => location.href = "/api/departments/export" },
                            react.createElement("i", { className: "fa fa-table", "aria-hidden": "true" })))),
                react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                    react.createElement("div", { className: "pagination-info" },
                        react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                    react.createElement("div", null,
                        react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
                react.createElement(Table, { parent: this, apiUrl: "/api/departments", columns: this.getColumns(), className: "small", getContextMenu: this.getContextMenu }),
                react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                    react.createElement("div", { className: "pagination-info" },
                        react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                    react.createElement("div", null,
                        react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))))));
    }
    changePage(page) {
        this.setState({
            page,
            updateTable: true
        });
    }
    delete(row) {
        if (confirm("Do you want to delete this department?")) {
            this.setState({ loading: true });
            Form.sendRequest("DELETE", "/api/departments/" + row.id).then(res => this.onDeleted(res), () => this.setState({
                errors: [Form.unknownError],
                loading: false
            }));
        }
    }
    onDeleted(res) {
        if (res.status == "ok")
            app.notification.show(react.createElement("div", null,
                "Department ",
                res.data.name,
                " successfully deleted"));
        this.setState({
            updateTable: true,
            errors: res.status == "error" ? res.errors.map(error => error.text) : [],
            loading: false
        });
    }
    getColumns() {
        let getColumn = (label, internalName = null, sortable = false, filterable = false, searchable = false, map = null) => {
            if (!internalName)
                internalName = label;
            return {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map
            };
        };
        let convertInactive = (row) => react.createElement("input", { type: "checkbox", disabled: true, checked: row.inactive });
        let convertId = (row) => react.createElement(react.Fragment, null,
            react.createElement(Link, { to: "/v2/mgmt/departments/edit/" + row.id }, "edit"),
            " | ",
            react.createElement("span", { className: "a", onClick: () => this.delete(row) }, "delete"));
        return [
            getColumn("Name", "name", true, true, true),
            getColumn("Inactive", "inactive", false, true, false, convertInactive),
            getColumn("", "id", false, false, false, convertId)
        ];
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/departments/DepartmentsForm.tsx




class DepartmentsForm extends react.Component {
    constructor(props) {
        super(props);
        this.valueSet = false;
        this.fields = this.getFields();
        this.state = {
            redirect: false,
            loading: false
        };
    }
    render() {
        if (this.props.value && !this.valueSet) {
            for (let field of this.fields)
                field.value = this.props.value[field.name];
            this.valueSet = true;
        }
        let submit = { value: this.props.submitLabel };
        let name = this.retrieve("name");
        let inactive = this.retrieve("inactive");
        return (react.createElement(react.Fragment, null,
            react.createElement(Access, { app: app, policy: "administrator" }),
            this.state.redirect ? react.createElement(Redirect, { to: this.props.redirectUrl }) : react.createElement(react.Fragment, null),
            react.createElement(Modal, { loading: true, visible: this.state.loading }),
            react.createElement(Form, { method: this.props.method, url: this.props.url, fields: this.fields, className: "form", send: () => this.setState({ loading: true }), success: res => this.handleSuccess(res), error: () => this.setState({ loading: false }) },
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: name })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: name })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: name }))),
                react.createElement("div", { className: "field" },
                    react.createElement(FormField, { field: inactive }),
                    " ",
                    react.createElement(FormFieldLabel, { field: inactive })),
                react.createElement("div", { className: "submit" },
                    react.createElement(FormSubmit, { submit: submit })),
                react.createElement("div", { className: "form-error" },
                    react.createElement(FormError, null)),
                react.createElement(Link, { className: "form-back-link", to: "/v2/mgmt/departments" }, "Back to Departments"))));
    }
    handleSuccess(res) {
        app.notification.show(react.createElement("div", null,
            "Department ",
            react.createElement(Link, { to: "/v2/mgmt/departments/edit/" + res.data.id }, res.data.name),
            " successfully ",
            this.props.formType == FormType.new ? "created" : "updated"));
        this.setState({
            loading: false,
            redirect: true
        });
    }
    retrieve(name) {
        return this.fields.find(f => f.name == name);
    }
    getFields() {
        return [
            {
                displayName: "Name",
                name: "name",
                required: true,
                type: FormFieldType.singleline,
                validate: value => [!!(typeof (value) != "undefined" && value != null ? value.trim() : null), null]
            },
            {
                id: "inactive",
                displayName: "Inactive",
                name: "inactive",
                type: FormFieldType.checkbox
            },
        ];
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/departments/DepartmentsEditForm.tsx



class DepartmentsEditForm extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            errors: []
        };
    }
    render() {
        return (react.createElement(react.Fragment, null,
            this.state.value == null ? react.createElement(FetchData, { obj: this, prop: "department", url: "/api/departments/" + this.props.match.params.id }) : react.createElement(react.Fragment, null),
            react.createElement(Modal, { loading: true, visible: this.state.value == null }),
            react.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backLabel: "Back to Departments", backUrl: "/v2/mgmt/departments" }),
            react.createElement(DepartmentsForm, { formType: FormType.edit, submitLabel: "Save", value: this.state.value, method: "PUT", url: "/api/departments/" + this.props.match.params.id, redirectUrl: "/v2/mgmt/departments" })));
    }
    componentDidMount() {
        if (this.department) {
            this.department
                .then(res => {
                if (res.status == "ok")
                    this.setState({ value: res.data });
                else
                    this.setState({ errors: res.errors.map(e => e.text) });
            }, error => this.setState({ errors: [Form.unknownErrorWithRefresh] }))
                .catch(error => this.setState({ errors: [Form.unknownErrorWithRefresh] }));
        }
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/departments/DepartmentsNewForm.tsx



class DepartmentsNewForm extends react.Component {
    render() {
        return (react.createElement(DepartmentsForm, { formType: FormType.new, submitLabel: "Create", method: "POST", url: "/api/departments", redirectUrl: "/v2/mgmt/departments" }));
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/companies/Companies.tsx




class Companies extends TableContainer {
    constructor(props) {
        super(props);
        this.getContextMenu = (row) => {
            return [
                {
                    label: "Edit",
                    icon: react.createElement("i", { className: "fas fa-info-circle" }),
                    route: "/v2/mgmt/companies/edit/" + row.id
                },
                {
                    label: "Delete",
                    icon: react.createElement("i", { className: "fas fa-edit" }),
                    action: () => this.delete(row)
                }
            ];
        };
        let state = this.state;
        state.pageTitle = "Companies";
        state.loading = false;
        state.errors = [];
    }
    render() {
        return (react.createElement(react.Fragment, null,
            react.createElement(Access, { app: app, policy: "administrator" }),
            react.createElement(Modal, { loading: true, visible: this.state.loading }),
            react.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backUrl: "/v2/mgmt/companies", backLabel: "Back to Companies" }),
            react.createElement("div", { className: "small-container" },
                react.createElement("div", { className: "report-search-area" },
                    react.createElement("div", { className: "report-search-left" },
                        react.createElement(Link, { to: "/v2/mgmt/companies/new" }, "Create New")),
                    react.createElement("div", { className: "report-search-space" }),
                    react.createElement("div", { className: "report-search-right" },
                        react.createElement(TableSearch, { parent: this })),
                    react.createElement("div", { className: "report-search-right" },
                        react.createElement("button", { className: "tv-button", onClick: () => location.href = "/api/companies/export" },
                            react.createElement("i", { className: "fa fa-table", "aria-hidden": "true" })))),
                react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                    react.createElement("div", { className: "pagination-info" },
                        react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                    react.createElement("div", null,
                        react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
                react.createElement(Table, { parent: this, apiUrl: "/api/companies", columns: this.getColumns(), className: "small", getContextMenu: this.getContextMenu }),
                react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                    react.createElement("div", { className: "pagination-info" },
                        react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                    react.createElement("div", null,
                        react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))))));
    }
    changePage(page) {
        this.setState({
            page,
            updateTable: true
        });
    }
    delete(row) {
        if (confirm("Do you want to delete this company?")) {
            this.setState({ loading: true });
            Form.sendRequest("DELETE", "/api/companies/" + row.id).then(res => this.onDeleted(res), () => this.setState({
                errors: [Form.unknownError],
                loading: false
            }));
        }
    }
    onDeleted(res) {
        if (res.status == "ok")
            app.notification.show(react.createElement("div", null,
                "Company ",
                res.data.name,
                " successfully deleted"));
        this.setState({
            updateTable: true,
            errors: res.status == "error" ? res.errors.map(error => error.text) : [],
            loading: false
        });
    }
    getColumns() {
        let getColumn = (label, internalName = null, sortable = false, filterable = false, searchable = false, map = null) => {
            if (!internalName)
                internalName = label;
            return {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map
            };
        };
        let convertInactive = (row) => react.createElement("input", { type: "checkbox", disabled: true, checked: row.inactive });
        let convertId = (row) => react.createElement(react.Fragment, null,
            react.createElement(Link, { to: "/v2/mgmt/companies/edit/" + row.id }, "edit"),
            " | ",
            react.createElement("span", { className: "a", onClick: () => this.delete(row) }, "delete"));
        return [
            getColumn("Name", "name", true, true, true),
            getColumn("Inactive", "inactive", false, true, false, convertInactive),
            getColumn("", "id", false, false, false, convertId)
        ];
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/companies/CompaniesForm.tsx




class CompaniesForm extends react.Component {
    constructor(props) {
        super(props);
        this.valueSet = false;
        this.fields = this.getFields();
        this.state = {
            redirect: false,
            loading: false
        };
    }
    render() {
        if (this.props.value && !this.valueSet) {
            for (let field of this.fields)
                field.value = this.props.value[field.name];
            this.valueSet = true;
        }
        let submit = { value: this.props.submitLabel };
        let name = this.retrieve("name");
        let inactive = this.retrieve("inactive");
        return (react.createElement(react.Fragment, null,
            react.createElement(Access, { app: app, policy: "administrator" }),
            this.state.redirect ? react.createElement(Redirect, { to: this.props.redirectUrl }) : react.createElement(react.Fragment, null),
            react.createElement(Modal, { loading: true, visible: this.state.loading }),
            react.createElement(Form, { method: this.props.method, url: this.props.url, fields: this.fields, className: "form", send: () => this.setState({ loading: true }), success: res => this.handleSuccess(res), error: () => this.setState({ loading: false }) },
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: name })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: name })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: name }))),
                react.createElement("div", { className: "field" },
                    react.createElement(FormField, { field: inactive }),
                    " ",
                    react.createElement(FormFieldLabel, { field: inactive })),
                react.createElement("div", { className: "submit" },
                    react.createElement(FormSubmit, { submit: submit })),
                react.createElement("div", { className: "form-error" },
                    react.createElement(FormError, null)),
                react.createElement(Link, { className: "form-back-link", to: "/v2/mgmt/companies" }, "Back to Companies"))));
    }
    handleSuccess(res) {
        app.notification.show(react.createElement("div", null,
            "Company ",
            react.createElement(Link, { to: "/v2/mgmt/companies/edit/" + res.data.id }, res.data.name),
            " successfully ",
            this.props.formType == FormType.new ? "created" : "updated"));
        this.setState({
            loading: false,
            redirect: true
        });
    }
    retrieve(name) {
        return this.fields.find(f => f.name == name);
    }
    getFields() {
        return [
            {
                displayName: "Name",
                name: "name",
                required: true,
                type: FormFieldType.singleline,
                validate: value => [!!(typeof (value) != "undefined" && value != null ? value.trim() : null), null]
            },
            {
                id: "inactive",
                displayName: "Inactive",
                name: "inactive",
                type: FormFieldType.checkbox
            },
        ];
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/companies/CompaniesEditForm.tsx



class CompaniesEditForm extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            errors: []
        };
    }
    render() {
        return (react.createElement(react.Fragment, null,
            this.state.value == null ? react.createElement(FetchData, { obj: this, prop: "company", url: "/api/companies/" + this.props.match.params.id }) : react.createElement(react.Fragment, null),
            react.createElement(Modal, { loading: true, visible: this.state.value == null }),
            react.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backLabel: "Back to Companies", backUrl: "/v2/mgmt/companies" }),
            react.createElement(CompaniesForm, { formType: FormType.edit, submitLabel: "Save", value: this.state.value, method: "PUT", url: "/api/companies/" + this.props.match.params.id, redirectUrl: "/v2/mgmt/companies" })));
    }
    componentDidMount() {
        if (this.company) {
            this.company
                .then(res => {
                if (res.status == "ok")
                    this.setState({ value: res.data });
                else
                    this.setState({ errors: res.errors.map(e => e.text) });
            }, error => this.setState({ errors: [Form.unknownErrorWithRefresh] }))
                .catch(error => this.setState({ errors: [Form.unknownErrorWithRefresh] }));
        }
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/companies/CompaniesNewForm.tsx



class CompaniesNewForm extends react.Component {
    render() {
        return (react.createElement(CompaniesForm, { formType: FormType.new, submitLabel: "Create", method: "POST", url: "/api/companies", redirectUrl: "/v2/mgmt/companies" }));
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/users/UsersForm.tsx




class UsersForm extends react.Component {
    constructor(props) {
        super(props);
        this.valueSet = false;
        this.onChange = () => {
            let lastName = this.retrieve("lastName").value.trim();
            let firstName = this.retrieve("firstName").value.trim();
            let logonName = this.retrieve("logonName").value.trim();
            let value = "";
            if (lastName || firstName) {
                if (lastName && firstName)
                    value = lastName + ", " + firstName;
                else
                    value = lastName ? lastName : firstName;
            }
            else if (logonName)
                value = logonName;
            let nameField = this.retrieve("name");
            nameField.value = value;
            nameField.fieldElement.setState({});
        };
        this.fields = this.getFields();
        this.state = {
            redirect: false,
            loading: false
        };
    }
    render() {
        if (this.props.value && !this.valueSet) {
            for (let field of this.fields)
                field.value = this.props.value[field.name];
            this.valueSet = true;
        }
        let submit = { value: this.props.submitLabel };
        let lastName = this.retrieve("lastName");
        let firstName = this.retrieve("firstName");
        let logonName = this.retrieve("logonName");
        let name = this.retrieve("name");
        let sites = this.retrieve("siteIds");
        let role = this.retrieve("role");
        let company = this.retrieve("companyId");
        let eMail = this.retrieve("eMail");
        return (react.createElement(react.Fragment, null,
            react.createElement(Access, { app: app, policy: "administrator" }),
            this.state.redirect ? react.createElement(Redirect, { to: this.props.redirectUrl }) : react.createElement(react.Fragment, null),
            react.createElement(Modal, { loading: true, visible: this.state.loading }),
            react.createElement(Form, { method: this.props.method, url: this.props.url, fields: this.fields, className: "form users", send: () => this.setState({ loading: true }), success: res => this.handleSuccess(res), error: () => this.setState({ loading: false }) },
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: lastName })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: lastName })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: lastName }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: firstName })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: firstName })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: firstName }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: name })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: name })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: name }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: role })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: role })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: role }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: logonName })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: logonName })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: logonName }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: eMail })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: eMail })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: eMail }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: company })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: company })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: company }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: sites })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: sites })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: sites }))),
                react.createElement("div", { className: "submit" },
                    react.createElement(FormSubmit, { submit: submit })),
                react.createElement("div", null),
                react.createElement("div", { className: "form-error" },
                    react.createElement(FormError, null)),
                react.createElement("div", null),
                react.createElement(Link, { className: "form-back-link", to: "/v2/mgmt/users" }, "Back to Users"))));
    }
    handleSuccess(res) {
        app.notification.show(react.createElement("div", null,
            react.createElement("span", null, "User "),
            react.createElement(Link, { to: "/v2/mgmt/users/edit/" + res.data.id }, res.data.name),
            react.createElement("span", null,
                " successfully ",
                this.props.formType == FormType.new ? "created" : "updated"),
            this.props.formType == FormType.new ?
                react.createElement(react.Fragment, null,
                    react.createElement("br", null),
                    react.createElement("br", null),
                    react.createElement("span", null, "User have to check his e-mail to activate an account")) :
                react.createElement(react.Fragment, null)));
        this.setState({
            loading: false,
            redirect: true
        });
    }
    retrieve(name) {
        return this.fields.find(f => f.name == name);
    }
    getFields() {
        return [
            {
                displayName: "Last Name",
                name: "lastName",
                type: FormFieldType.singleline,
                onChange: this.onChange
            },
            {
                displayName: "First Name",
                name: "firstName",
                type: FormFieldType.singleline,
                onChange: this.onChange
            },
            {
                displayName: "Logon Name",
                name: "logonName",
                type: FormFieldType.singleline,
                onChange: this.onChange,
                required: true
            },
            {
                displayName: "Name",
                name: "name",
                type: FormFieldType.singleline,
                disabled: true,
                required: true
            },
            {
                displayName: "Sites",
                name: "siteIds",
                type: FormFieldType.multiselect,
                options: app.sites
            },
            {
                displayName: "Role",
                name: "role",
                type: FormFieldType.multiselect,
                options: [
                    { text: "Administrator", value: "1" },
                    { text: "Site Administrator", value: "2" },
                    { text: "Supervisor", value: "4" },
                    { text: "SSHE User", value: "8" },
                    { text: "Voting User", value: "16" }
                ],
                mapValue: (values) => values.reduce((v1, v2) => (parseInt(v1) | parseInt(v2)).toString()),
                required: true
            },
            {
                displayName: "Company",
                name: "companyId",
                type: FormFieldType.select,
                options: app.companies,
                required: true
            },
            {
                displayName: "EMail",
                name: "eMail",
                type: FormFieldType.singleline,
                required: true,
                validate: (value) => [/^[a-zA-Z\d]?[a-zA-Z\d\-_\.]*[a-zA-Z\d]{1}@[a-zA-Z\d]?[a-zA-Z\d\.\-]*[a-zA-Z\d]{1}\.[a-zA-Z]+$/.test(value), "Wrong e-mail format"]
            }
        ];
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/users/UsersEditForm.tsx



class UsersEditForm extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            errors: []
        };
    }
    render() {
        return (react.createElement(react.Fragment, null,
            this.state.value == null ? react.createElement(FetchData, { obj: this, prop: "user", url: "/api/users/" + this.props.match.params.id, map: res => this.mapUser(res) }) : react.createElement(react.Fragment, null),
            react.createElement(Modal, { loading: true, visible: this.state.value == null }),
            react.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backLabel: "Back to Users", backUrl: "/v2/mgmt/users" }),
            react.createElement(UsersForm, { formType: FormType.edit, submitLabel: "Save", value: this.state.value, method: "PUT", url: "/api/users/" + this.props.match.params.id, redirectUrl: "/v2/mgmt/users" })));
    }
    mapUser(res) {
        if (!Array.isArray(res.data.role)) {
            let count = new UsersForm(null).getFields().find(f => f.name == "role").options.length;
            let role = res.data.role;
            let roles = [];
            for (let i = 0; i < count; i++) {
                let current = Math.pow(2, i);
                if ((role & current) == current)
                    roles.push(current);
            }
            res.data.role = roles;
        }
        return res;
    }
    componentDidMount() {
        if (this.user) {
            this.user
                .then(res => {
                if (res.status == "ok")
                    this.setState({ value: res.data });
                else
                    this.setState({ errors: res.errors.map(e => e.text) });
            }, error => this.setState({ errors: [Form.unknownErrorWithRefresh] }))
                .catch(error => this.setState({ errors: [Form.unknownErrorWithRefresh] }));
        }
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/users/UsersNewForm.tsx



class UsersNewForm extends react.Component {
    render() {
        return (react.createElement(UsersForm, { formType: FormType.new, submitLabel: "Create", method: "POST", url: "/api/users", redirectUrl: "/v2/mgmt/users" }));
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/employees/Employees.tsx





class Employees extends TableContainer {
    constructor(props) {
        super(props);
        this.getContextMenu = (row) => {
            let items = [];
            if (UserService.correspondsPolicy("siteAdministrator")) {
                items.push({
                    label: "Edit",
                    icon: react.createElement("i", { className: "fas fa-info-circle" }),
                    route: "/v2/mgmt/employees/edit/" + row.id
                });
            }
            if (UserService.correspondsPolicy("administrator")) {
                items.push({
                    label: "Edit",
                    icon: react.createElement("i", { className: "fas fa-info-circle" }),
                    route: "/v2/mgmt/employees/edit/" + row.id
                });
            }
            return items;
        };
        let state = this.state;
        state.pageTitle = "Employees (NGH)";
        state.loading = false;
        state.errors = [];
    }
    render() {
        let isSiteAdministrator = UserService.correspondsPolicy("siteAdministrator");
        let hasContextMenu = UserService.correspondsPolicy("administrator") || isSiteAdministrator;
        return (react.createElement(react.Fragment, null,
            react.createElement(Modal, { loading: true, visible: this.state.loading }),
            react.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backUrl: "/v2/mgmt/employees", backLabel: "Back to Employees" }),
            react.createElement("div", { className: "employees-container" },
                react.createElement("div", { className: "report-search-area" },
                    react.createElement("div", { className: "report-search-left" }, isSiteAdministrator ? react.createElement(Link, { to: "/v2/mgmt/employees/new" }, "Create New") : react.createElement(react.Fragment, null)),
                    react.createElement("div", { className: "report-search-space" }),
                    react.createElement("div", { className: "report-search-right" },
                        react.createElement(TableSearch, { parent: this })),
                    react.createElement("div", { className: "report-search-right" },
                        react.createElement("button", { className: "tv-button", onClick: () => location.href = "/api/employees/export" },
                            react.createElement("i", { className: "fa fa-table", "aria-hidden": "true" })))),
                react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                    react.createElement("div", { className: "pagination-info" },
                        react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                    react.createElement("div", null,
                        react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
                react.createElement(Table, { parent: this, apiUrl: "/api/employees", columns: this.getColumns(), className: "employees", getContextMenu: hasContextMenu ? this.getContextMenu : null }),
                react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                    react.createElement("div", { className: "pagination-info" },
                        react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                    react.createElement("div", null,
                        react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))))));
    }
    changePage(page) {
        this.setState({
            page,
            updateTable: true
        });
    }
    delete(row) {
        if (confirm("Do you want to delete this employee?")) {
            this.setState({ loading: true });
            Form.sendRequest("DELETE", "/api/employees/" + row.id).then(res => this.onDeleted(res), () => this.setState({
                errors: [Form.unknownError],
                loading: false
            }));
        }
    }
    onDeleted(res) {
        if (res.status == "ok")
            app.notification.show(react.createElement("div", null,
                "Employee",
                res.data.name ? " " + res.data.name + "," : "",
                " NGH # ",
                res.data.code,
                " successfully deleted"));
        this.setState({
            updateTable: true,
            errors: res.status == "error" ? res.errors.map(error => error.text) : [],
            loading: false
        });
    }
    getColumns() {
        let getColumn = (label, internalName = null, sortable = false, filterable = false, searchable = false, map = null) => {
            if (!internalName)
                internalName = label;
            return {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map
            };
        };
        let isAdministrator = UserService.correspondsPolicy("administrator");
        let isSiteAdministrator = UserService.correspondsPolicy("siteAdministrator");
        let convertInactive = (row) => react.createElement("input", { type: "checkbox", disabled: true, checked: row.inactive });
        let convertId = (row) => {
            let links = [];
            if (isSiteAdministrator)
                links.push(react.createElement(Link, { to: "/v2/mgmt/employees/edit/" + row.id }, "edit"));
            if (isAdministrator) {
                if (links.length > 0)
                    links.push(react.createElement("span", null, " | "));
                links.push(react.createElement("span", { className: "a", onClick: () => this.delete(row) }, "delete"));
            }
            return react.createElement(react.Fragment, null, links);
        };
        let columns = [
            getColumn("NGH #", "code", true, false, true),
            getColumn("First Name", "firstName", true, false, true),
            getColumn("Last Name", "lastName", true, false, true),
            getColumn("Site", "site", true, true, true),
            getColumn("Company", "company", true, true, true),
            getColumn("Department", "department", true, true, true),
            getColumn("PTS #", "ptsNumber", false, false, true),
            getColumn("Additional Information", "additionalInfo", false, false, true),
            getColumn("Created", "date", true, true, false, row => react.createElement("span", null, utility.convertDate(row.date))),
            getColumn("Inactive", "inactive", false, true, false, convertInactive)
        ];
        if (isAdministrator || isSiteAdministrator)
            columns.push(getColumn("", "id", false, false, false, convertId));
        return columns;
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/employees/EmployeesForm.tsx




class EmployeesForm extends react.Component {
    constructor(props) {
        super(props);
        this.valueSet = false;
        this.onChange = () => {
            let lastName = this.retrieve("lastName").value.trim();
            let firstName = this.retrieve("firstName").value.trim();
            let value = "";
            if (lastName || firstName) {
                if (lastName && firstName)
                    value = lastName + ", " + firstName;
                else
                    value = lastName ? lastName : firstName;
            }
            let nameField = this.retrieve("name");
            nameField.value = value;
            nameField.fieldElement.setState({});
        };
        this.fields = this.getFields();
        this.state = {
            redirect: false,
            loading: false
        };
    }
    render() {
        if (this.props.value && !this.valueSet) {
            for (let field of this.fields)
                field.value = this.props.value[field.name];
            this.valueSet = true;
        }
        let submit = { value: this.props.submitLabel };
        let code = this.retrieve("code");
        let inactive = this.retrieve("inactive");
        let lastName = this.retrieve("lastName");
        let firstName = this.retrieve("firstName");
        let name = this.retrieve("name");
        let site = this.retrieve("siteId");
        let company = this.retrieve("companyId");
        let department = this.retrieve("departmentId");
        let ptsNumber = this.retrieve("ptsNumber");
        let additionalInfo = this.retrieve("additionalInfo");
        return (react.createElement(react.Fragment, null,
            react.createElement(Access, { app: app, policy: "siteAdministrator" }),
            this.state.redirect ? react.createElement(Redirect, { to: this.props.redirectUrl }) : react.createElement(react.Fragment, null),
            react.createElement(Modal, { loading: true, visible: this.state.loading }),
            react.createElement(Form, { method: this.props.method, url: this.props.url, fields: this.fields, className: "form employees", send: () => this.setState({ loading: true }), success: res => this.handleSuccess(res), error: () => this.setState({ loading: false }) },
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: code })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: code })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: code }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: name })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: name })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: name }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: lastName })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: lastName })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: lastName }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: firstName })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: firstName })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: firstName }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: site })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: site })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: site }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: department })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: department })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: department }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: company })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: company })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: company }))),
                react.createElement("div", null),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: ptsNumber })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: ptsNumber })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: ptsNumber }))),
                react.createElement("div", null),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: additionalInfo })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: additionalInfo })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: additionalInfo }))),
                react.createElement("div", null),
                react.createElement("div", { className: "control" },
                    react.createElement(FormField, { field: inactive }),
                    " ",
                    react.createElement(FormFieldLabel, { field: inactive })),
                react.createElement("div", null),
                react.createElement("div", { className: "submit" },
                    react.createElement(FormSubmit, { submit: submit })),
                react.createElement("div", null),
                react.createElement("div", { className: "form-error" },
                    react.createElement(FormError, null)),
                react.createElement("div", null),
                react.createElement(Link, { className: "form-back-link", to: "/v2/mgmt/employees" }, "Back to Employees"))));
    }
    handleSuccess(res) {
        app.notification.show(react.createElement("div", null,
            react.createElement("span", null,
                "Employee",
                res.data.name ? " " + res.data.name + "," : "",
                " NGH # "),
            react.createElement(Link, { to: "/v2/mgmt/employees/edit/" + res.data.id }, res.data.code),
            react.createElement("span", null,
                " successfully ",
                this.props.formType == FormType.new ? "created" : "updated")));
        this.setState({
            loading: false,
            redirect: true
        });
    }
    retrieve(name) {
        return this.fields.find(f => f.name == name);
    }
    getFields() {
        return [
            {
                displayName: "NGH #",
                name: "code",
                type: FormFieldType.singleline,
                disabled: true
            },
            {
                displayName: "Inactive",
                name: "inactive",
                id: "inactive",
                type: FormFieldType.checkbox
            },
            {
                displayName: "Last Name",
                name: "lastName",
                type: FormFieldType.singleline,
                onChange: this.onChange
            },
            {
                displayName: "First Name",
                name: "firstName",
                type: FormFieldType.singleline,
                onChange: this.onChange
            },
            {
                displayName: "Name",
                name: "name",
                type: FormFieldType.singleline,
                disabled: true
            },
            {
                displayName: "Site",
                name: "siteId",
                type: FormFieldType.select,
                options: app.sites,
                required: true
            },
            {
                displayName: "Company",
                name: "companyId",
                type: FormFieldType.select,
                options: app.companies,
                required: true
            },
            {
                displayName: "Department",
                name: "departmentId",
                type: FormFieldType.select,
                options: app.departments,
                required: true
            },
            {
                displayName: "PTS #",
                name: "ptsNumber",
                type: FormFieldType.singleline
            },
            {
                displayName: "Aditional Information",
                name: "additionalInfo",
                type: FormFieldType.multiline
            }
        ];
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/employees/EmployeesNewForm.tsx



class EmployeesNewForm extends react.Component {
    render() {
        return (react.createElement(EmployeesForm, { formType: FormType.new, submitLabel: "Create", method: "POST", url: "/api/employees", redirectUrl: "/v2/mgmt/employees" }));
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/employees/EmployeesEditForm.tsx



class EmployeesEditForm extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            errors: []
        };
    }
    render() {
        return (react.createElement(react.Fragment, null,
            this.state.value == null ? react.createElement(FetchData, { obj: this, prop: "employee", url: "/api/employees/" + this.props.match.params.id, map: res => this.mapEmployee(res) }) : react.createElement(react.Fragment, null),
            react.createElement(Modal, { loading: true, visible: this.state.value == null }),
            react.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backLabel: "Back to Employees", backUrl: "/v2/mgmt/employees" }),
            react.createElement(EmployeesForm, { formType: FormType.edit, submitLabel: "Save", value: this.state.value, method: "PUT", url: "/api/employees/" + this.props.match.params.id, redirectUrl: "/v2/mgmt/employees" })));
    }
    mapEmployee(res) {
        return res;
    }
    componentDidMount() {
        if (this.employee) {
            this.employee
                .then(res => {
                if (res.status == "ok")
                    this.setState({ value: res.data });
                else
                    this.setState({ errors: res.errors.map(e => e.text) });
            }, error => this.setState({ errors: [Form.unknownErrorWithRefresh] }))
                .catch(error => this.setState({ errors: [Form.unknownErrorWithRefresh] }));
        }
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/reporting/Graphics.tsx



class Graphics extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDatePicker: false,
            dateFrom: DateRangePicker.getRange("cm")[0],
            dateTo: null,
            query: new Map(),
            loading: true
        };
        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }
    render() {
        return (react.createElement("div", null,
            react.createElement(Modal, { height: 270, header: "Select range", visible: this.state.showDatePicker, onClose: () => this.setState({ showDatePicker: false }) },
                react.createElement(DateRangePicker, { onChange: (from, to) => this.dateRangeSelected(from, to) })),
            react.createElement(Modal, { loading: true, visible: this.state.loading }),
            react.createElement("div", { className: "report-search-area" },
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.sites.map(s => s.text), multiple: true, placeholder: "Select sites...", width: 200, onChange: v => this.onFieldValueChanged("sites", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.companies.map(s => s.text), multiple: true, placeholder: "Select companies...", width: 200, onChange: v => this.onFieldValueChanged("companies", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.departments.map(s => s.text), multiple: true, placeholder: "Select departments...", width: 200, onChange: v => this.onFieldValueChanged("departments", v) })),
                react.createElement("div", { className: "report-search-left nopadding" },
                    react.createElement("input", { type: "date", placeholder: "From...", value: this.state.dateFrom, onChange: e => this.onDateChanged(e.currentTarget.value, "from") }),
                    "\u00A0-\u00A0",
                    react.createElement("input", { type: "date", placeholder: "To...", value: this.state.dateTo, onChange: e => this.onDateChanged(e.currentTarget.value, "to") }),
                    " \u00A0"),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement("button", { className: "date-picker-button", onClick: () => this.setState({ showDatePicker: true }) }, "...")),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement("button", { onClick: () => this.getReport() }, "Get Report"))),
            react.createElement("table", { className: "canvasTable", style: { visibility: this.state.loading ? "hidden" : "visible" } },
                react.createElement("tr", null,
                    react.createElement("td", { id: "bar1" }),
                    react.createElement("td", { id: "bar2" }),
                    react.createElement("td", { id: "bar3", colSpan: 2 })),
                react.createElement("tr", null,
                    react.createElement("td", { id: "bar4", colSpan: 4 })),
                react.createElement("tr", null,
                    react.createElement("td", { id: "bar5", colSpan: 2 }),
                    react.createElement("td", { id: "bar6", colSpan: 2 })),
                react.createElement("tr", null,
                    react.createElement("td", { id: "pie1", style: { width: "25%" } }),
                    react.createElement("td", { id: "pie2", style: { width: "25%" } }),
                    react.createElement("td", { id: "pie3", style: { width: "25%" } }),
                    react.createElement("td", { id: "pie4", style: { width: "25%" } })),
                react.createElement("tr", null,
                    react.createElement("td", { id: "bar7", colSpan: 4 })))));
    }
    componentDidMount() {
        this.getReport();
    }
    getReport() {
        if (!this.state.loading)
            this.setState({ loading: true });
        let url = "/api/reporting/graphics";
        let add = [];
        for (let key of this.state.query.keys())
            this.state.query.get(key).forEach(v => add.push(key + "=" + encodeURIComponent(v)));
        if (add.length > 0)
            url += (url.indexOf("?") == -1 ? "?" : "&") + add.join("&");
        fetch(url)
            .then(res => res.json())
            .then(res => {
            this.createPie1(res.data.base);
            this.createPie2(res.data.base);
            this.createPie3(res.data.base);
            this.createPie4(res.data.base);
            this.createBar1(res.data.base);
            this.createBar2(res.data.base);
            this.createBar3(res.data.byDepartment);
            this.createBar4(res.data.byCompany);
            this.createBar5(res.data.byENLDepartment);
            this.createBar6(res.data.base);
            this.createBar7(res.data.base);
            this.setState({ loading: false });
        });
    }
    onDateChanged(value, field) {
        if (field == "from")
            this.setState({ dateFrom: value });
        else if (field == "to")
            this.setState({ dateTo: value });
        this.onFieldValueChanged(field, [value]);
    }
    onFieldValueChanged(field, values) {
        this.state.query.set(field, values);
    }
    dateRangeSelected(from, to) {
        this.onFieldValueChanged("from", [from]);
        if (to)
            this.onFieldValueChanged("to", [to]);
        this.setState({
            dateFrom: from,
            dateTo: to,
            showDatePicker: false
        });
    }
    createBar7(data) {
        var ar = [
            "PPE", "PPE",
            "PinchPoints", "Pinch Points",
            "ContactWithObject", "Contact With Object",
            "HandsSafety", "Hands Safety",
            "Housekeeping", "Housekeeping",
            "OffTheSite", "Off the Site",
            "WeatherConditions", "Weather Conditions",
            "COVID19", "COVID-19",
            "WarningSigns", "Warning Signs / Barricades",
            "Ergonomics", "Ergonomics",
            "ToolsEquipment", "Tools Equipment",
            "WellControl", "Well Control",
            "PoliciesProcedures", "Policies / Procedures",
            "Security", "Security",
            "WorkEnvironmental", "Work Environmental / Design",
            "ManualLifting", "Manual Lifting / Handling",
            "ProcessSafety", "Process Safety",
            "Environmental", "Environmental",
            "Chemicals", "Chemicals",
            "LineOfFire", "\"Line of Fire\"",
            "Other", "Other",
            "TransportSafety", "Transport Safety",
            "StressRush", "Stress / Rush / Fatique / Distraction",
            "ElectricalSafety", "Electrical Safety",
            "SlipsTripsFalls", "Slips Trips Falls",
            "FireSafety", "Fire Safety",
            "Communication", "Communication",
            "Hygiene", "Hygiene",
            "DroppedObjects", "Dropped Objects"
        ];
        var dataset1 = [];
        var dataset2 = [];
        var dataset3 = [];
        var labels = [];
        for (var i = 0; i < ar.length; i += 2) {
            dataset1.push(data["hid" + (ar[i] == "PPE" ? "ppe" : ar[i])]);
            dataset2.push(data["safe" + ar[i]]);
            dataset3.push(data["unsafe" + ar[i]]);
            labels.push(ar[i + 1]);
        }
        var config = {
            type: 'bar',
            data: {
                datasets: [
                    {
                        label: "Hazard ID",
                        data: dataset1,
                        backgroundColor: "#740000",
                        datalabels: { anchor: 'end' }
                    },
                    {
                        label: "Safe Behavior",
                        data: dataset2,
                        backgroundColor: "#00B050",
                        datalabels: { anchor: 'end' }
                    },
                    {
                        label: "Unsafe Behavior",
                        data: dataset3,
                        backgroundColor: "#FF0000",
                        datalabels: { anchor: 'end' }
                    }
                ],
                labels: labels
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { fontColor: "#000" }
                },
                title: {
                    display: true,
                    text: "Number of Reports Submitted",
                    fontColor: "#000",
                    fontSize: 15
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                fontColor: "#000",
                            }
                        }],
                    xAxes: [{
                            ticks: {
                                fontColor: "#000"
                            }
                        }]
                },
                plugins: {
                    datalabels: {
                        color: "black",
                        align: "top",
                        offset: -3,
                        display: (context) => context.dataset.data[context.dataIndex] !== 0
                    }
                }
            },
        };
        new Chart(this.getContext("bar7", "380px", "280px"), config);
    }
    createBar6(data) {
        var ar = [
            "LiftingAndHoisting", "Lifting and Hoisting",
            "MobileEquipment", "Mobile Equipment",
            "RotatingEquipment", "Rotating Equipment",
            "BreakingContainment", "Breaking Containment",
            "WorkingAtHeight", "Working at Height",
            "HotWork", "Hot Work",
            "ConfinedSpaceEntry", "Confined Space Entry",
            "EnergyIsolation", "Energy Isolation",
            "WorkAuthorization", "Work Authorization",
            "CriticalDevices", "Critical Devices",
            "CriticalProcedures", "Critical Procedures"
        ];
        var dataset1 = [];
        var dataset2 = [];
        var labels = [];
        for (var i = 0; i < ar.length; i += 2) {
            dataset1.push(data["safe" + ar[i]]);
            dataset2.push(data["unsafe" + ar[i]]);
            labels.push(ar[i + 1]);
        }
        var config = {
            type: 'bar',
            data: {
                datasets: [
                    {
                        label: "Safe",
                        data: dataset1,
                        backgroundColor: "#6A4090"
                    },
                    {
                        label: "Unsafe",
                        data: dataset2,
                        backgroundColor: "#ED7D31"
                    },
                ],
                labels: labels
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'right',
                    labels: { fontColor: "#000" }
                },
                title: {
                    display: true,
                    text: "Life Saving Actions",
                    fontColor: "#000",
                    fontSize: 15
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                fontColor: "#000"
                            }
                        }],
                    xAxes: [{ ticks: { fontColor: "#000" } }]
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },
        };
        new Chart(this.getContext("bar6", "380px", "280px"), config);
    }
    createBar5(data) {
        var chartData = {
            datasets: [{
                    data: data.map(i => i["count"]),
                    backgroundColor: data.map(i => "#6A408F")
                }],
            labels: data.map(i => i["department"])
        };
        var config = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Number of Reports Submitted by ENL Department",
                    fontColor: "#000",
                    fontSize: 15
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                fontColor: "#000"
                            }
                        }],
                    xAxes: [{ ticks: { fontColor: "#000" } }]
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },
        };
        new Chart(this.getContext("bar5", "380px", "280px"), config);
    }
    createBar4(data) {
        var chartData = {
            datasets: [{
                    data: data.map(i => i["count"]),
                    backgroundColor: data.map(i => "#4472C5"),
                    datalabels: { anchor: 'end' }
                }],
            labels: data.map(i => i["company"])
        };
        var config = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Number of Reports Submitted by Company",
                    fontColor: "#000",
                    fontSize: 15
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                fontColor: "#000"
                            }
                        }],
                    xAxes: [{ ticks: { fontColor: "#000" } }]
                },
                plugins: {
                    datalabels: {
                        color: "black",
                        align: "top",
                        offset: -3,
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },
        };
        new Chart(this.getContext("bar4", "380px", "280px"), config);
    }
    createBar3(data) {
        var chartData = {
            datasets: [{
                    data: data.map(i => i["count"]),
                    backgroundColor: data.map(i => "#548134")
                }],
            labels: data.map(i => i["department"])
        };
        var config = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: false,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Number of Reports Submitted by Department",
                    fontColor: "#000",
                    fontSize: 15
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                fontColor: "#000"
                            }
                        }],
                    xAxes: [{ ticks: { fontColor: "#000" } }]
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },
        };
        new Chart(this.getContext("bar3", "100%", "280px"), config);
        document.getElementById("bar3_canvas").style.position = "relative";
        document.getElementById("bar3_canvas").style.top = "-20px";
    }
    createBar2(data) {
        var n1 = data["total"];
        var n2 = data["hazardID"];
        var n3 = data["totalBehavior"];
        var n4 = data["safeBehavior"];
        var n5 = data["unsafeBehavior"];
        var config = {
            type: 'bar',
            data: {
                datasets: [
                    {
                        label: "Safe",
                        data: [n4, 0, n4],
                        backgroundColor: ["green", "green", "green"]
                    },
                    {
                        label: "Unsafe",
                        data: [n2 + n5, n2, n5],
                        backgroundColor: ["red", "red", "red"]
                    },
                ],
                labels: ["Total", "Hazard ID", "Behavior Based Observations"]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'right',
                    labels: { fontColor: "#000" }
                },
                title: {
                    display: true,
                    text: "Number of Reports Submitted",
                    fontColor: "#000",
                    fontSize: 15
                },
                scales: {
                    xAxes: [{
                            stacked: true,
                            ticks: { fontColor: "#000" }
                        }],
                    yAxes: [{
                            stacked: true,
                            ticks: {
                                beginAtZero: true,
                                fontColor: "#000"
                            }
                        }]
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },
        };
        new Chart(this.getContext("bar2", "380px", "280px"), config);
        document.getElementById("bar2_canvas").style.position = "relative";
        document.getElementById("bar2_canvas").style.top = "-20px";
    }
    createBar1(data) {
        var n1 = data["total"];
        var n2 = data["hazardID"];
        var n3 = data["totalBehavior"];
        var n4 = data["safeBehavior"];
        var n5 = data["unsafeBehavior"];
        var config = {
            type: 'bar',
            data: {
                datasets: [{
                        data: [n1, n2, n3, n4, n5],
                        backgroundColor: ["#2A7DFF", "#FF6F0D", "#FFC261", "#19B225", "#DB5757"]
                    }],
                labels: ["Total", "Hazard ID", "Total Behavior Based Observations", "Safe Behavior", "Unsafe Behavior"],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Number of Reports Submitted",
                    fontColor: "#000",
                    fontSize: 15
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                fontColor: "#000",
                                beginAtZero: true
                            }
                        }],
                    xAxes: [{ ticks: { fontColor: "#000" } }]
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },
        };
        new Chart(this.getContext("bar1", "380px", "330px"), config);
    }
    createPie1(data) {
        var sum = data["notApplicable"] + data["headBeforeHands"] + data["stayFocused"] + data["lmra"] + data["biases"] + data["safetyTraps"];
        var n1 = this.getPercent(data["notApplicable"], sum);
        var n2 = this.getPercent(data["headBeforeHands"], sum);
        var n3 = this.getPercent(data["stayFocused"], sum);
        var n4 = this.getPercent(data["lmra"], sum);
        var n5 = this.getPercent(data["biases"], sum);
        var n6 = this.getPercent(data["safetyTraps"], sum);
        var config = {
            type: 'doughnut',
            data: {
                datasets: [{
                        data: [n1, n2, n3, n4, n5, n6],
                        backgroundColor: ["#a3a3a3", "#8DA7D9", "#E97C30", "#FB0000", "#FBBD00", "#6EAB46"],
                    }],
                labels: ["Not Applicable", "Head Before Hands", "Stay Focused", "LMRA", "Biases", "Safety Traps"]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'right',
                    labels: { fontColor: "#000" }
                },
                title: {
                    display: true,
                    text: "Safe Choice",
                    fontColor: "#000",
                    fontSize: 15
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        formatter: value => value + "%",
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },
        };
        new Chart(this.getContext("pie1", "380px", "280px"), config);
    }
    createPie2(data) {
        var sum = data["hazardID"] + data["totalBehavior"];
        var n1 = this.getPercent(data["hazardID"], sum);
        var n2 = this.getPercent(data["totalBehavior"], sum);
        var config = {
            type: 'doughnut',
            data: {
                datasets: [{
                        data: [n1, n2],
                        backgroundColor: ["#001E5E", "#FBC104"],
                    }],
                labels: ["Hazard ID", "Total Behavior Based Observation"]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'right',
                    labels: { fontColor: "#000" }
                },
                title: {
                    display: true,
                    text: "Types of Proactive Reports",
                    fontColor: "#000",
                    fontSize: 15
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        formatter: value => value + "%",
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },
        };
        new Chart(this.getContext("pie2", "465px", "280px"), config);
    }
    createPie3(data) {
        var sum = data["safeBehavior"] + data["unsafeBehavior"];
        var n1 = this.getPercent(data["safeBehavior"], sum);
        var n2 = this.getPercent(data["unsafeBehavior"], sum);
        var config = {
            type: 'doughnut',
            data: {
                datasets: [{
                        data: [n1, n2],
                        backgroundColor: ["#00AD4E", "#BD0000"],
                    }],
                labels: ["Save", "Unsafe"]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'right',
                    labels: { fontColor: "#000" }
                },
                title: {
                    display: true,
                    text: "Behavior Based Observations",
                    fontColor: "#000",
                    fontSize: 15
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        formatter: value => value + "%",
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },
        };
        new Chart(this.getContext("pie3", "317px", "280px"), config);
    }
    createPie4(data) {
        var sum = data["safeLSA"] + data["unsafeLSA"] + data["nonLSA"];
        var n1 = this.getPercent(data["safeLSA"], sum);
        var n2 = this.getPercent(data["unsafeLSA"], sum);
        var n3 = this.getPercent(data["nonLSA"], sum);
        var config = {
            type: 'doughnut',
            data: {
                datasets: [{
                        data: [n1, n2, n3],
                        backgroundColor: ["#00AD4E", "#BD0000", "#a3a3a3"],
                    }],
                labels: ["Safe LSA", "Unsafe LSA", "non-LSA"]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    position: 'right',
                    labels: { fontColor: "#000" }
                },
                title: {
                    display: true,
                    text: "Percentage of LSA Observations",
                    fontColor: "#000",
                    fontSize: 15
                },
                plugins: {
                    datalabels: {
                        color: 'white',
                        formatter: value => value + "%",
                        display: c => c.dataset.data[c.dataIndex] !== 0
                    }
                }
            },
        };
        new Chart(this.getContext("pie4", "345px", "280px"), config);
    }
    getContext(id, width, height) {
        let cell = document.getElementById(id);
        cell.innerHTML = "";
        let canvas = document.createElement("canvas");
        canvas.id = id + "_canvas";
        canvas.style.width = width;
        canvas.style.height = height;
        cell.appendChild(canvas);
        return canvas.getContext("2d");
    }
    getPercent(num, sum) {
        return Math.round(100.0 * num / sum);
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/reporting/Participation.tsx



class Participation extends TableContainer {
    constructor(props) {
        super(props);
        this.onYearChanged = (e) => {
            let value = e.currentTarget.value;
            this.setState({ year: parseInt(e.currentTarget.value) });
            this.onFieldValueChanged("year", [value]);
        };
        let state = this.state;
        state.pageTitle = "Participation report";
        state.month = new Date().getMonth() + 1;
        state.year = new Date().getFullYear();
        this.onFieldValueChanged("month", [this.state.month.toString()]);
        this.onFieldValueChanged("year", [this.state.year.toString()]);
    }
    render() {
        return (react.createElement("div", null,
            react.createElement("div", { className: "report-search-area" },
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.sites.map(s => s.text), multiple: true, placeholder: "Select sites...", width: 200, onChange: v => this.onFieldValueChanged("sites", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.companies.map(s => s.text), multiple: true, placeholder: "Select companies...", width: 200, onChange: v => this.onFieldValueChanged("companies", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.departments.map(s => s.text), multiple: true, placeholder: "Select departments...", width: 200, onChange: v => this.onFieldValueChanged("departments", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: this.getMonths(), width: 200, values: [this.state.month.toString()], onChange: (values) => {
                            this.setState({ month: parseInt(values[0]) });
                            this.onFieldValueChanged("month", values);
                        } })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement("input", { type: "number", value: this.state.year, onChange: this.onYearChanged })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement("button", { onClick: () => this.getReport() }, "Get Report")),
                react.createElement("div", { className: "report-search-space" }),
                react.createElement("div", { className: "report-search-right" },
                    react.createElement(TableSearch, { parent: this }))),
            react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                react.createElement("div", { className: "pagination-info" },
                    react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                react.createElement("div", null,
                    react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
            this.columns ?
                react.createElement(Table, { parent: this, className: "participation", apiUrl: "/api/reporting/participation", columns: this.columns },
                    react.createElement("div", { className: "participation-top-cell-left" }, "By observer"),
                    this.daysInMonth > 0 ?
                        react.createElement("div", { className: "participation-top-cell-right", style: { gridColumn: "span " + this.daysInMonth } }, this.getMonths().find(m => m.value == this.state.month.toString()).text) :
                        react.createElement(react.Fragment, null),
                    react.createElement(TableDefaultHeader, null)) :
                react.createElement(react.Fragment, null),
            react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                react.createElement("div", { className: "pagination-info" },
                    react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                react.createElement("div", null,
                    react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) })))));
    }
    componentDidMount() {
        this.getReport();
    }
    getMonths() {
        return [
            { value: "1", text: "January" },
            { value: "2", text: "February" },
            { value: "3", text: "March" },
            { value: "4", text: "April" },
            { value: "5", text: "May" },
            { value: "6", text: "June" },
            { value: "7", text: "July" },
            { value: "8", text: "August" },
            { value: "9", text: "September" },
            { value: "10", text: "October" },
            { value: "11", text: "November" },
            { value: "12", text: "December" }
        ];
    }
    changePage(page) {
        this.setState({
            page,
            updateTable: true
        });
    }
    getReport() {
        this.columns = this.getColumns();
        this.setState({
            updateTable: true,
            query: this.state.query
        });
    }
    onFieldValueChanged(field, values) {
        this.state.query.set(field, values);
    }
    getColumns() {
        let getColumn = (label, internalName, headerCellClass = null, getAdditionalCellClass = null) => {
            return {
                label,
                internalName,
                sortable: true,
                filterable: ["code", "name"].indexOf(internalName) == -1,
                searchable: true,
                hasTotal: ["code", "name", "company", "department", "site"].indexOf(internalName) == -1,
                headerCellClass,
                getAdditionalCellClass
            };
        };
        let columns = [
            getColumn("NGH #", "code"),
            getColumn("Name", "name"),
            getColumn("Company", "company"),
            getColumn("Department", "department"),
            getColumn("Site", "site"),
            getColumn("Total Cards", "totalCards"),
        ];
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth() + 1;
        let currentYear = currentDate.getFullYear();
        this.daysInMonth = currentMonth == this.state.month && currentYear == this.state.year ? currentDate.getDate() : new Date(this.state.year, this.state.month, 0).getDate();
        if (this.state.year > currentYear || (this.state.year == currentYear && this.state.month > currentMonth))
            this.daysInMonth = 0;
        for (let i = 1; i <= this.daysInMonth; i++)
            columns.push(getColumn((i <= 9 ? "0" : "") + i, "d" + i, "participation-header-cell-date", (row, column) => {
                let count = parseInt(row[column]);
                return count > 0 ? (count == 1 ? "participation-cell-one" : "participation-cell-many") : "participation-cell-any";
            }));
        return columns;
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/reporting/OIMS.tsx



class OIMS extends TableContainer {
    constructor(props) {
        super(props);
        let state = this.state;
        state.showDatePicker = false;
        state.dateFrom = DateRangePicker.getRange("cm")[0];
        state.pageTitle = "OIMS System 5-4 KPIs Data";
        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }
    render() {
        let columns = this.getColumns();
        return (react.createElement("div", null,
            react.createElement(Modal, { height: 270, header: "Select range", visible: this.state.showDatePicker, onClose: () => this.setState({ showDatePicker: false }) },
                react.createElement(DateRangePicker, { onChange: (from, to) => this.dateRangeSelected(from, to) })),
            react.createElement("div", { className: "report-search-area" },
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.sites.map(s => s.text), multiple: true, placeholder: "Select sites...", width: 200, onChange: v => this.onFieldValueChanged("sites", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.companies.map(s => s.text), multiple: true, placeholder: "Select companies...", width: 200, onChange: v => this.onFieldValueChanged("companies", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.departments.map(s => s.text), multiple: true, placeholder: "Select departments...", width: 200, onChange: v => this.onFieldValueChanged("departments", v) })),
                react.createElement("div", { className: "report-search-left nopadding" },
                    react.createElement("input", { type: "date", placeholder: "From...", value: this.state.dateFrom, onChange: e => this.onDateChanged(e.currentTarget.value, "from") }),
                    "\u00A0-\u00A0",
                    react.createElement("input", { type: "date", placeholder: "To...", value: this.state.dateTo, onChange: e => this.onDateChanged(e.currentTarget.value, "to") }),
                    " \u00A0"),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement("button", { className: "date-picker-button", onClick: () => this.setState({ showDatePicker: true }) }, "...")),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement("button", { onClick: () => this.getReport() }, "Get Report")),
                react.createElement("div", { className: "report-search-space" }),
                react.createElement("div", { className: "report-search-right" },
                    react.createElement(TableSearch, { parent: this }))),
            react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                react.createElement("div", { className: "pagination-info" },
                    react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                react.createElement("div", null,
                    react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
            react.createElement(Table, { parent: this, className: "oims", apiUrl: "/api/reporting/oims", columns: columns },
                react.createElement(TableDefaultHeader, null,
                    react.createElement("div", { className: "oims-top-cell" }, "Participation by Site"),
                    react.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "site"), additionalClass: "oims-rowspan2" }),
                    react.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "totalCards"), additionalClass: "oims-rowspan2" }),
                    react.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "hid"), additionalClass: "oims-rowspan2" }),
                    react.createElement("div", { className: "oims-colspan3" }, "BBO"),
                    react.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "hidPercent"), additionalClass: "oims-rowspan2" }),
                    react.createElement("div", { className: "oims-colspan3" }, "BBO%"),
                    react.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "openActionItems"), additionalClass: "oims-rowspan2" }),
                    react.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "expiredActionItems"), additionalClass: "oims-rowspan2" }),
                    react.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "actionItemsWithoutDates"), additionalClass: "oims-rowspan2" }),
                    react.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "safeBehavior") }),
                    react.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "unsafeBehavior") }),
                    react.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "safeUnsafeTotal") }),
                    react.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "safeBehaviorPercent") }),
                    react.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "unsafeBehaviorPercent") }),
                    react.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "safeUnsafeTotalPercent") }))),
            react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                react.createElement("div", { className: "pagination-info" },
                    react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                react.createElement("div", null,
                    react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) })))));
    }
    changePage(page) {
        this.setState({
            page,
            updateTable: true
        });
    }
    getReport() {
        this.setState({
            updateTable: true,
            query: this.state.query
        });
    }
    onDateChanged(value, field) {
        if (field == "from")
            this.setState({ dateFrom: value });
        else if (field == "to")
            this.setState({ dateTo: value });
        this.onFieldValueChanged(field, [value]);
    }
    onFieldValueChanged(field, values) {
        this.state.query.set(field, values);
    }
    dateRangeSelected(from, to) {
        this.onFieldValueChanged("from", [from]);
        if (to)
            this.onFieldValueChanged("to", [to]);
        this.setState({
            dateFrom: from,
            dateTo: to,
            showDatePicker: false
        });
    }
    getColumns() {
        let getColumn = (label, internalName) => {
            return {
                label,
                internalName,
                sortable: true,
                filterable: true,
                searchable: true,
                hasTotal: internalName != "site",
            };
        };
        let columns = [
            getColumn("Site", "site"),
            getColumn("Total Number of Reports", "totalCards"),
            getColumn("HID", "hid"),
            getColumn("Safe Behavior", "safeBehavior"),
            getColumn("Unsafe Behavior", "unsafeBehavior"),
            getColumn("Total", "safeUnsafeTotal"),
            getColumn("HID%", "hidPercent"),
            getColumn("Safe", "safeBehaviorPercent"),
            getColumn("Unsafe", "unsafeBehaviorPercent"),
            getColumn("Total", "safeUnsafeTotalPercent"),
            getColumn("Open + In Progress Action Items", "openActionItems"),
            getColumn("Open + In Progress Action Items With Expired Target Date", "expiredActionItems"),
            getColumn("Open + In Progress Action Items Without Assigned Target Date", "actionItemsWithoutDates")
        ];
        return columns;
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/reporting/Observer.tsx



class Observer extends TableContainer {
    constructor(props) {
        super(props);
        let state = this.state;
        state.showDatePicker = false;
        state.dateFrom = DateRangePicker.getRange("cm")[0];
        state.pageTitle = "User report (by Observer)";
        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }
    render() {
        return (react.createElement("div", null,
            react.createElement(Modal, { height: 270, header: "Select range", visible: this.state.showDatePicker, onClose: () => this.setState({ showDatePicker: false }) },
                react.createElement(DateRangePicker, { onChange: (from, to) => this.dateRangeSelected(from, to) })),
            react.createElement("div", { className: "report-search-area" },
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.sites.map(s => s.text), multiple: true, placeholder: "Select sites...", width: 200, onChange: v => this.onFieldValueChanged("sites", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.companies.map(s => s.text), multiple: true, placeholder: "Select companies...", width: 200, onChange: v => this.onFieldValueChanged("companies", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.departments.map(s => s.text), multiple: true, placeholder: "Select departments...", width: 200, onChange: v => this.onFieldValueChanged("departments", v) })),
                react.createElement("div", { className: "report-search-left nopadding" },
                    react.createElement("input", { type: "date", placeholder: "From...", value: this.state.dateFrom, onChange: e => this.onDateChanged(e.currentTarget.value, "from") }),
                    "\u00A0-\u00A0",
                    react.createElement("input", { type: "date", placeholder: "To...", value: this.state.dateTo, onChange: e => this.onDateChanged(e.currentTarget.value, "to") }),
                    " \u00A0"),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement("button", { className: "date-picker-button", onClick: () => this.setState({ showDatePicker: true }) }, "...")),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement("button", { onClick: () => this.getReport() }, "Get Report")),
                react.createElement("div", { className: "report-search-space" }),
                react.createElement("div", { className: "report-search-right" },
                    react.createElement(TableSearch, { parent: this }))),
            react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                react.createElement("div", { className: "pagination-info" },
                    react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                react.createElement("div", null,
                    react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
            react.createElement(Table, { parent: this, className: "observer", apiUrl: "/api/reporting/observer", columns: this.getColumns() },
                react.createElement("div", { className: "observer-top-cell-left" }, "By Observer"),
                react.createElement("div", { className: "observer-top-cell-right" }, "Cards Submitted by Month"),
                react.createElement(TableDefaultHeader, null)),
            react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                react.createElement("div", { className: "pagination-info" },
                    react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                react.createElement("div", null,
                    react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) })))));
    }
    changePage(page) {
        this.setState({
            page,
            updateTable: true
        });
    }
    getReport() {
        this.setState({
            updateTable: true,
            query: this.state.query
        });
    }
    onDateChanged(value, field) {
        if (field == "from")
            this.setState({ dateFrom: value });
        else if (field == "to")
            this.setState({ dateTo: value });
        this.onFieldValueChanged(field, [value]);
    }
    onFieldValueChanged(field, values) {
        this.state.query.set(field, values);
    }
    dateRangeSelected(from, to) {
        this.onFieldValueChanged("from", [from]);
        if (to)
            this.onFieldValueChanged("to", [to]);
        this.setState({
            dateFrom: from,
            dateTo: to,
            showDatePicker: false
        });
    }
    getColumns() {
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let getColumn = (label, internalName = null, sortable = false, filterable = false, searchable = false, hasTotal = false, map = null) => {
            if (!internalName)
                internalName = label;
            let column = {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                hasTotal,
                map
            };
            let light = ["offTheSite", "security", "environmental"];
            column.headerCellClass = light.indexOf(internalName) != -1 ? "observer-header-cell2" : (months.indexOf(label) != -1 ? "observer-header-cell3" : "observer-header-cell1");
            return column;
        };
        let columns = [
            getColumn("Name", "name", true, true, true),
            getColumn("Company", "company", true, true, true),
            getColumn("Department", "department", true, true, true),
            getColumn("Site", "site", true, true, true),
            getColumn("Total Cards", "totalCards", true, true, true, true),
            getColumn("HID", "hid", true, true, true, true),
            getColumn("Safe Behavior", "safeBehavior", true, true, true, true),
            getColumn("Unsafe Behavior", "unsafeBehavior", true, true, true, true),
            getColumn("Off-the-Site", "offTheSite", true, true, true, true),
            getColumn("Security", "security", true, true, true, true),
            getColumn("Environmental", "environmental", true, true, true, true)
        ];
        months.forEach(m => columns.push(getColumn(m, m.toLowerCase(), true, true, true, true)));
        return columns;
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/reporting/Cord.tsx



class Cord extends TableContainer {
    constructor(props) {
        super(props);
        let state = this.state;
        state.showDatePicker = false;
        state.dateFrom = DateRangePicker.getRange("cm")[0];
        state.pageTitle = "User report (company or department participation)";
        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }
    render() {
        return (react.createElement("div", { className: "cord-container" },
            react.createElement(Modal, { height: 270, header: "Select range", visible: this.state.showDatePicker, onClose: () => this.setState({ showDatePicker: false }) },
                react.createElement(DateRangePicker, { onChange: (from, to) => this.dateRangeSelected(from, to) })),
            react.createElement("div", { className: "report-search-area" },
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.sites.map(s => s.text), multiple: true, placeholder: "Select sites...", width: 200, onChange: v => this.onFieldValueChanged("sites", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.companies.map(s => s.text), multiple: true, placeholder: "Select companies...", width: 200, onChange: v => this.onFieldValueChanged("companies", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.departments.map(s => s.text), multiple: true, placeholder: "Select departments...", width: 200, onChange: v => this.onFieldValueChanged("departments", v) })),
                react.createElement("div", { className: "report-search-left nopadding" },
                    react.createElement("input", { type: "date", placeholder: "From...", value: this.state.dateFrom, onChange: e => this.onDateChanged(e.currentTarget.value, "from") }),
                    "\u00A0-\u00A0",
                    react.createElement("input", { type: "date", placeholder: "To...", value: this.state.dateTo, onChange: e => this.onDateChanged(e.currentTarget.value, "to") }),
                    " \u00A0"),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement("button", { className: "date-picker-button", onClick: () => this.setState({ showDatePicker: true }) }, "...")),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement("button", { onClick: () => this.getReport() }, "Get Report")),
                react.createElement("div", { className: "report-search-space" }),
                react.createElement("div", { className: "report-search-right" },
                    react.createElement(TableSearch, { parent: this }))),
            react.createElement("br", null),
            react.createElement("br", null),
            react.createElement(Table, { parent: this, className: "cordcompany", apiUrl: "/api/reporting/cord/byCompany", columns: this.getColumns("byCompany") },
                react.createElement("div", { className: "cord-top-cell-company" }, "Participation by Company"),
                react.createElement(TableDefaultHeader, null)),
            react.createElement("br", null),
            react.createElement("br", null),
            react.createElement(Table, { parent: this, className: "corddept", apiUrl: "/api/reporting/cord/byDepartment", columns: this.getColumns("byDepartment") },
                react.createElement("div", { className: "cord-top-cell-dept" }, "Participation by Department"),
                react.createElement(TableDefaultHeader, null)),
            react.createElement("br", null),
            react.createElement("br", null),
            react.createElement(Table, { parent: this, className: "cordenldept", apiUrl: "/api/reporting/cord/byENLDepartment", columns: this.getColumns("byENLDepartment") },
                react.createElement("div", { className: "cord-top-cell-enldept" }, "Participation by ENL Department"),
                react.createElement(TableDefaultHeader, null))));
    }
    getReport() {
        this.setState({
            updateTable: true,
            query: this.state.query
        });
    }
    onDateChanged(value, field) {
        if (field == "from")
            this.setState({ dateFrom: value });
        else if (field == "to")
            this.setState({ dateTo: value });
        this.onFieldValueChanged(field, [value]);
    }
    onFieldValueChanged(field, values) {
        this.state.query.set(field, values);
    }
    dateRangeSelected(from, to) {
        this.onFieldValueChanged("from", [from]);
        if (to)
            this.onFieldValueChanged("to", [to]);
        this.setState({
            dateFrom: from,
            dateTo: to,
            showDatePicker: false
        });
    }
    getColumns(type) {
        let getColumn = (label, internalName = null, sortable = false, filterable = false, searchable = false, map = null) => {
            if (!internalName)
                internalName = label;
            let column = {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map
            };
            column.headerCellClass = type == "byCompany" ? "cord-header-cell-company" : (type == "byDepartment" ? "cord-header-cell-dept" : "cord-header-cell-enldept");
            if (internalName == "offTheSite" || internalName == "security" || internalName == "environmental")
                column.headerCellClass += "-light";
            if (internalName != "cord")
                column.hasTotal = true;
            return column;
        };
        let getCordFieldName = (type) => type == "byCompany" ? "Company" : (type == "byDepartment" ? "Department" : "ENL Department");
        return [
            getColumn(getCordFieldName(type), "cord", true, true, true),
            getColumn("Total Cards Submitted for the Period", "totalCards", true, true, true),
            getColumn("HID", "hid", true, true, true),
            getColumn("Safe Behavior", "safeBehavior", true, true, true),
            getColumn("Unsafe Behavior", "unsafeBehavior", true, true, true),
            getColumn("Off-The-Site", "offTheSite", true, true, true),
            getColumn("Security", "security", true, true, true),
            getColumn("Environmental", "environmental", true, true, true),
        ];
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/reporting/ActionItemForm.tsx





class ActionItemForm extends react.Component {
    constructor(props) {
        super(props);
        this.submit = {
            value: "Save"
        };
        this.state = { detailsVisible: false };
    }
    render() {
        ActionItemForm.fields = this.getFields();
        return (react.createElement(react.Fragment, null, !this.state.detailsVisible ?
            react.createElement(Form, { method: "PUT", url: "/api/actionitems/" + this.props.actionItem.id, fields: ActionItemForm.fields, className: "form ai-form", send: () => this.props.onSend(), success: res => this.props.onSuccess(res), error: res => this.props.onError(res) },
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: this.retrive("status") })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: this.retrive("status") })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: this.retrive("status") }))),
                react.createElement("div", { onClick: () => this.setState({ detailsVisible: true }), className: "ai-card-details-label" },
                    react.createElement("span", { className: "a", onClick: () => this.setState({ detailsVisible: true }) }, "Card details")),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: this.retrive("responsibleId") })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: this.retrive("responsibleId") })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: this.retrive("otherResponsible") })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: this.retrive("responsibleId") })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: this.retrive("otherResponsible") }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: this.retrive("closedBy") })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: this.retrive("closedBy") })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: this.retrive("closedBy") }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: this.retrive("furtherActions") })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: this.retrive("furtherActions") })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: this.retrive("furtherActions") }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: this.retrive("comments") })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: this.retrive("comments") }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: this.retrive("targetDate") })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: this.retrive("targetDate") })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: this.retrive("targetDate") }))),
                react.createElement("div", { className: "field" },
                    react.createElement("div", { className: "label" },
                        react.createElement(FormFieldLabel, { field: this.retrive("closureDate") })),
                    react.createElement("div", { className: "control" },
                        react.createElement(FormField, { field: this.retrive("closureDate") })),
                    react.createElement("div", { className: "error" },
                        react.createElement(FormFieldError, { field: this.retrive("closureDate") }))),
                react.createElement("div", null,
                    react.createElement(FormSubmit, { submit: this.submit })),
                react.createElement("div", null,
                    react.createElement("button", { className: "cancel", onClick: () => this.props.onClose() }, "Cancel"))) :
            react.createElement("div", { className: "ai-card-details" },
                react.createElement("span", { className: "a ai-card-details-backlabel", onClick: () => this.setState({ detailsVisible: false }) }, "Back to Action Item"),
                react.createElement(CardDetails, { card: this.props.actionItem.card }))));
    }
    static clear() {
        ActionItemForm.fields = null;
    }
    getFields() {
        let fields = [];
        let departments = app.departments.filter(opt => opt.text != "Blank");
        departments.push({ value: "0", text: "Other" });
        let statusField = {
            name: "status",
            displayName: "Status",
            type: FormFieldType.select,
            options: [
                { value: ActionItemStatus.open.toString(), text: this.getStatusDisplayName(ActionItemStatus.open) },
                { value: ActionItemStatus.inProgress.toString(), text: this.getStatusDisplayName(ActionItemStatus.inProgress) },
                { value: ActionItemStatus.closed.toString(), text: this.getStatusDisplayName(ActionItemStatus.closed) }
            ],
            onChange: () => this.setState({}),
            value: ActionItemForm.fields ? this.retrive("status").value : [this.props.actionItem.status],
        };
        let status = this.getStatusByCode(statusField.value);
        fields.push(statusField);
        let responsbileField = {
            name: "responsibleId",
            displayName: "Reponsible Party",
            type: FormFieldType.select,
            options: departments,
            required: status != ActionItemStatus.open,
            disabled: status != ActionItemStatus.inProgress,
            onChange: () => this.setState({}),
            value: ActionItemForm.fields ? this.retrive("responsibleId").value : (this.props.actionItem.responsible ? this.props.actionItem.responsible.id : null)
        };
        let isOther = responsbileField.value == "0";
        fields.push(responsbileField);
        fields.push({
            name: "otherResponsible",
            type: FormFieldType.singleline,
            visible: isOther,
            placeholder: "Input any value here",
            required: isOther,
            value: ActionItemForm.fields ? this.retrive("otherResponsible").value : this.props.actionItem.otherResponsible
        });
        fields.push({
            name: "furtherActions",
            displayName: "Further Actions (заполнять на английском)",
            type: FormFieldType.multiline,
            required: status != ActionItemStatus.open,
            disabled: status != ActionItemStatus.inProgress,
            value: ActionItemForm.fields ? this.retrive("furtherActions").value : this.props.actionItem.furtherActions
        });
        fields.push({
            name: "targetDate",
            displayName: "Target Date",
            type: FormFieldType.datetime,
            required: status != ActionItemStatus.open,
            disabled: status != ActionItemStatus.inProgress,
            value: ActionItemForm.fields ? this.retrive("targetDate").value : this.dateToControl(this.props.actionItem.targetDate),
            validate: (value) => {
                if (!value)
                    return [false, Form.requiredFieldError];
                let validated = new Date(value).getTime() >= new Date(this.props.currentDate).getTime();
                return [validated, !validated ? "Target date cannot be less than today" : null];
            }
        });
        fields.push({
            name: "closedBy",
            displayName: "Closed by",
            type: FormFieldType.singleline,
            required: status == ActionItemStatus.closed,
            disabled: true,
            value: (() => {
                if (status != ActionItemStatus.closed)
                    return "";
                return ActionItemForm.fields ? app.currentUser.name : this.props.actionItem.closedBy.name;
            })()
        });
        fields.push({
            name: "comments",
            displayName: "Closeout Comments (заполнять на английском)",
            type: FormFieldType.multiline,
            disabled: status != ActionItemStatus.closed,
            value: (() => {
                if (status != ActionItemStatus.closed)
                    return "";
                return ActionItemForm.fields ? this.retrive("comments").value : this.props.actionItem.comments;
            })()
        });
        fields.push({
            name: "closureDate",
            displayName: "Date of Closure",
            type: FormFieldType.datetime,
            required: status == ActionItemStatus.closed,
            disabled: true,
            value: (() => {
                if (status != ActionItemStatus.closed)
                    return "";
                return ActionItemForm.fields ? this.props.currentDate : this.dateToControl(this.props.actionItem.closureDate);
            })()
        });
        if (ActionItemForm.fields) {
            for (let field of fields) {
                let existing = ActionItemForm.fields.find(f => f.name == field.name);
                if (existing) {
                    field.fieldElement = existing.fieldElement;
                    field.fieldErrorElement = existing.fieldErrorElement;
                    field.fieldLabelElement = existing.fieldLabelElement;
                    field.error = existing.error;
                }
            }
        }
        return fields;
    }
    retrive(name) {
        let field = ActionItemForm.fields.find(f => f.name == name);
        if (!field)
            throw new Error("field '" + name + "' does not exist");
        return field;
    }
    dateToControl(date) {
        return date ? date.split("T")[0] : "";
    }
    getStatusDisplayName(status) {
        if (status == ActionItemStatus.open)
            return "Open";
        if (status == ActionItemStatus.inProgress)
            return "In Progress";
        if (status == ActionItemStatus.closed)
            return "Closed";
        return null;
    }
    getStatusByCode(status) {
        let displayName = ActionItemStatus[parseInt(status)];
        if (displayName == "open")
            return ActionItemStatus.open;
        if (displayName == "inProgress")
            return ActionItemStatus.inProgress;
        if (displayName == "closed")
            return ActionItemStatus.closed;
        return null;
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/reporting/Closeout.tsx






var ActionItemStatus;
(function (ActionItemStatus) {
    ActionItemStatus[ActionItemStatus["open"] = 0] = "open";
    ActionItemStatus[ActionItemStatus["inProgress"] = 1] = "inProgress";
    ActionItemStatus[ActionItemStatus["closed"] = 2] = "closed";
})(ActionItemStatus || (ActionItemStatus = {}));
class Closeout extends TableContainer {
    constructor(props) {
        super(props);
        this.getContextMenu = (row) => {
            return [
                {
                    label: "Edit",
                    icon: react.createElement("i", { className: "fas fa-edit" }),
                    action: () => this.showEdit(row)
                }
            ];
        };
        let state = this.state;
        state.showDatePicker = false;
        state.dateFrom = DateRangePicker.getRange("cm")[0];
        state.pageTitle = "Close-out report (action items data)";
        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }
    render() {
        return (react.createElement("div", null,
            react.createElement(Modal, { height: 270, header: "Select range", visible: this.state.showDatePicker, onClose: () => this.setState({ showDatePicker: false }) },
                react.createElement(DateRangePicker, { onChange: (from, to) => this.dateRangeSelected(from, to) })),
            react.createElement(Modal, { visible: this.state.editFormVisible, loading: this.state.editFormLoading, width: 1060, onClose: () => {
                    ActionItemForm.clear();
                    this.setState({ editFormVisible: false });
                } },
                react.createElement(ActionItemForm, { actionItem: this.state.actionItem, currentDate: this.state.currentDate, onClose: () => {
                        ActionItemForm.clear();
                        this.setState({ editFormVisible: false });
                    }, onSend: () => this.setState({ editFormLoading: true }), onSuccess: res => {
                        ActionItemForm.clear();
                        this.setState({
                            editFormVisible: false,
                            updateTable: true
                        });
                    }, onError: res => {
                        if (res.errors.filter(e => !!e.field).length > 0) {
                            this.setState({
                                editFormLoading: false
                            });
                        }
                        else {
                            this.setState({
                                editFormVisible: false,
                                errorVisible: true,
                                errorMessage: res && res.errors.length > 0 ? res.errors[0].text : Form.unknownError
                            });
                        }
                    } })),
            react.createElement(ModalError, { visible: this.state.errorVisible, errors: [this.state.errorMessage], onClose: () => this.setState({ errorVisible: false }) }),
            react.createElement("div", { className: "report-search-area" },
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.sites.map(s => s.text), multiple: true, placeholder: "Select sites...", width: 200, onChange: v => this.onFieldValueChanged("sites", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.companies.map(s => s.text), multiple: true, placeholder: "Select companies...", width: 200, onChange: v => this.onFieldValueChanged("companies", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.departments.map(s => s.text), multiple: true, placeholder: "Select departments...", width: 200, onChange: v => this.onFieldValueChanged("departments", v) })),
                react.createElement("div", { className: "report-search-left nopadding" },
                    react.createElement("input", { type: "date", placeholder: "From...", value: this.state.dateFrom, onChange: e => this.onDateChanged(e.currentTarget.value, "from") }),
                    "\u00A0-\u00A0",
                    react.createElement("input", { type: "date", placeholder: "To...", value: this.state.dateTo, onChange: e => this.onDateChanged(e.currentTarget.value, "to") }),
                    " \u00A0"),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement("button", { className: "date-picker-button", onClick: () => this.setState({ showDatePicker: true }) }, "...")),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement("button", { onClick: () => this.getReport() }, "Get Report")),
                react.createElement("div", { className: "report-search-space" }),
                react.createElement("div", { className: "report-search-right" },
                    react.createElement(TableSearch, { parent: this }))),
            react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                react.createElement("div", { className: "pagination-info" },
                    react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                react.createElement("div", null,
                    react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
            react.createElement(Table, { parent: this, className: "closeout", apiUrl: "/api/reporting/closeout", columns: this.getColumns(), getContextMenu: this.getContextMenu, getAdditionalRowClass: row => row.status == "Open" ? "closeout-cell-open" : (row.status == "Closed" ? "closeout-cell-closed" : "closeout-cell-inprogress"), getAdditionalRowClassHover: row => row.status == "Open" ? "closeout-cell-open-hover" : (row.status == "Closed" ? "closeout-cell-closed-hover" : "closeout-cell-inprogress-hover") },
                react.createElement("div", { className: "closeout-top-cell" },
                    react.createElement(react_switch.default, { onChange: () => this.toggleLang(), checked: this.state.lang == Language.rus, uncheckedIcon: react.createElement("div", { className: "switch-label" }, "eng"), checkedIcon: react.createElement("div", { className: "switch-label" }, "rus"), height: 25, width: 60 })),
                react.createElement(TableDefaultHeader, null)),
            react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                react.createElement("div", { className: "pagination-info" },
                    react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                react.createElement("div", null,
                    react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) })))));
    }
    showEdit(row) {
        this.setState({
            editFormLoading: true,
            editFormVisible: true
        });
        let handleError = () => {
            this.setState({
                editFormLoading: false,
                editFormVisible: false,
                errorVisible: true,
                errorMessage: "Failed to retrieve card data"
            });
        };
        http.fetch("/api/date")
            .then(res => {
            if (res.status == "ok") {
                let date = res.data.split("T")[0];
                http.fetch("/api/actionitems/" + row.id)
                    .then(res => {
                    if (res.status == "ok") {
                        this.setState({
                            editFormLoading: false,
                            actionItem: res.data,
                            currentDate: date
                        });
                    }
                    else
                        handleError();
                })
                    .catch(() => handleError());
            }
            else
                handleError();
        })
            .catch(() => handleError());
    }
    toggleLang() {
        let lang = Language.rus;
        if (this.state.lang == Language.rus)
            lang = Language.eng;
        this.setState({ lang });
    }
    changePage(page) {
        this.setState({
            page,
            updateTable: true
        });
    }
    getReport() {
        this.setState({
            updateTable: true,
            query: this.state.query
        });
    }
    onDateChanged(value, field) {
        if (field == "from")
            this.setState({ dateFrom: value });
        else if (field == "to")
            this.setState({ dateTo: value });
        this.onFieldValueChanged(field, [value]);
    }
    onFieldValueChanged(field, values) {
        this.state.query.set(field, values);
    }
    dateRangeSelected(from, to) {
        this.onFieldValueChanged("from", [from]);
        if (to)
            this.onFieldValueChanged("to", [to]);
        this.setState({
            dateFrom: from,
            dateTo: to,
            showDatePicker: false
        });
    }
    getColumns() {
        let getColumn = (label, internalName = null, sortable = false, filterable = false, searchable = false, map = null, headerCellClass = null) => {
            if (!internalName)
                internalName = label;
            let column = {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map,
                headerCellClass
            };
            column.onDoubleClick = row => this.showEdit(row);
            return column;
        };
        let getStringByLang = (text, lang) => react.createElement(react.Fragment, null, text ? text.split("{-DELIM-}")[lang == Language.rus ? 1 : 0] : "");
        return [
            getColumn("Site", "site", true, true, true),
            getColumn("Date", "date", true, true, false, row => react.createElement("span", null, utility.convertDate(row.date))),
            getColumn("Observer Name", "name", true, true, true),
            getColumn("Company", "company", true, true, true),
            getColumn("Observer Department", "department", true, true, true),
            getColumn("Description", "description", false, false, true, row => getStringByLang(row.description, this.state.lang)),
            getColumn("Actions Taken", "actionsTaken", false, false, true, row => getStringByLang(row.actionsTaken, this.state.lang)),
            getColumn("Specific Location", "location", false, false, true, row => getStringByLang(row.location, this.state.lang)),
            getColumn("Actions Suggested", "suggestedFurtherActions", false, false, true, row => getStringByLang(row.suggestedFurtherActions, this.state.lang)),
            getColumn("Status", "status", true, true, true, null, "closeout-header-cell"),
            getColumn("Further Actions", "furtherActions", false, false, true, null, "closeout-header-cell"),
            getColumn("Responsible Party", "responsible", true, true, true, null, "closeout-header-cell"),
            getColumn("Target Date", "targetDate", true, true, false, row => react.createElement("span", null, utility.convertDate(row.targetDate)), "closeout-header-cell"),
            getColumn("Closeout Comments", "closeoutComments", false, false, true, null, "closeout-header-cell"),
            getColumn("Closed by", "closedBy", true, true, true, null, "closeout-header-cell"),
            getColumn("Date of Closure", "closureDate", true, true, false, row => react.createElement("span", null, utility.convertDate(row.closureDate)), "closeout-header-cell")
        ];
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/reporting/Nomination.tsx






class Nomination extends TableContainer {
    constructor(props) {
        super(props);
        this.columns = [];
        this.getContextMenu = (row) => {
            let items = [];
            items.push({
                label: "Details",
                icon: react.createElement("i", { className: "fas fa-info-circle" }),
                action: () => this.showDetails(row)
            });
            if (this.state.stage == 1 || this.state.stage == 2) {
                items.push({
                    label: "Change category",
                    icon: react.createElement("i", { className: "fas fa-vote-yea" }),
                    action: () => this.showNominationSelector(row)
                });
                items.push({
                    label: "Exclude from Report",
                    icon: react.createElement("i", { className: "fas fa-trash-alt" }),
                    action: () => this.excludeCards(row.id)
                });
            }
            else if (this.state.stage == 3 && this.isVotingUser) {
                items.push({
                    label: row.stage3VoteMade ? "Down Vote" : "Up Vote",
                    icon: react.createElement("i", { className: "fas fa-vote-yea" }),
                    action: () => row.stage3VoteMade ? this.unsetVote(row) : this.setVote(row)
                });
            }
            else if (this.state.stage == 4 && this.isSSHEUser) {
                if (row.isWinner) {
                    items.push({
                        label: "Remove Winner Status",
                        icon: react.createElement("i", { className: "fas fa-trash-alt" }),
                        action: () => this.unsetWinner(row)
                    });
                }
                else {
                    items.push({
                        label: "Set as a Winner",
                        icon: react.createElement("i", { className: "fas fa-trophy" }),
                        action: () => this.setWinner(row)
                    });
                    items.push({
                        label: "Up Vote",
                        icon: react.createElement("i", { className: "fas fa-vote-yea" }),
                        action: () => this.offsetVote(row, 1)
                    });
                    items.push({
                        label: "Down Vote",
                        icon: react.createElement("i", { className: "fas fa-vote-yea" }),
                        action: () => this.offsetVote(row, -1)
                    });
                }
            }
            return items;
        };
        this.setVote = row => this.vote(row, true);
        this.unsetVote = (row) => this.vote(row, false);
        this.setWinner = row => this.winner(row, true);
        this.unsetWinner = (row) => this.winner(row, false);
        this.changeStage = () => {
            if (this.state.selectedStage && this.state.selectedStage != this.state.stage) {
                let params = new Map();
                params.set("stage", this.state.selectedStage.toString());
                http.fetch("/api/reporting/nomination/" + this.state.reportId + "/changestage", HttpMethod.put, params)
                    .then(res => {
                    if (res.status == "ok")
                        this.setState({ updateTable: true });
                    else
                        this.handleError(res.errors[0].text);
                })
                    .catch(() => this.handleError());
            }
        };
        this.excludeCards = (cardId = null) => {
            let selected = this.state.rows.filter(row => row.selected);
            if ((selected.length > 0 || cardId != null) && confirm("Do you want to exclude selected cards from the report?")) {
                let params = new Map();
                params.set("cardIds", cardId != null ? [cardId.toString()] : this.state.rows.filter(row => row.selected).map(row => row.id.toString()));
                http.fetch("/api/reporting/nomination/" + this.state.reportId + "/exclude", HttpMethod.delete, params)
                    .then(res => {
                    if (res.status == "ok")
                        this.setState({ updateTable: true });
                    else
                        this.handleError();
                })
                    .catch(() => this.handleError());
            }
        };
        this.setReportData = (res) => {
            if (res.status == "ok") {
                if (res.data.from && res.data.to) {
                    this.setState({
                        reportId: res.data.reportId,
                        rows: res.data.rows,
                        from: this.convertDate(res.data.from),
                        to: this.convertDate(res.data.to),
                        stage: res.data.stage,
                        selectedStage: 0
                    });
                }
                else {
                }
            }
        };
        this.isSSHEUser = UserService.correspondsPolicy("nominationSSHEUser");
        this.isVotingUser = UserService.correspondsPolicy("nominationVotingUser");
    }
    render() {
        this.columns = this.getColumns();
        if (!this.state.query.has("site"))
            this.onFieldValueChanged("site", [app.sites[0].text]);
        let categories = ["All"];
        categories = categories.concat(app.nominationCategories);
        return (react.createElement("div", null,
            react.createElement(Access, { app: app, policy: "nomination" }),
            react.createElement(Modal, { visible: this.state.detailsVisible, loading: this.state.detailsLoading, width: 900, onClose: () => this.setState({ detailsVisible: false }) },
                react.createElement(CardDetails, { card: this.state.details })),
            react.createElement(Modal, { visible: this.state.nominationSelectorVisible, loading: this.state.nominationLoading, width: 400, height: 240, header: "Select category", onClose: () => this.setState({ nominationSelectorVisible: false }) },
                react.createElement(Select, { options: app.nominationCategories, dropdownWidth: "500px", onChange: values => this.categorySelected(values[0]), values: this.state.nominationCategory ? [this.state.nominationCategory] : null })),
            react.createElement(ModalError, { visible: this.state.errorVisible, errors: [this.state.errorMessage], onClose: () => this.setState({ errorVisible: false }) }),
            react.createElement("div", { className: "report-search-area" },
                react.createElement("div", { className: "report-search-left nomination-date-range" },
                    react.createElement("span", null, (this.state.from && this.state.to) ? this.state.from + " - " + this.state.to : "")),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.sites.map(s => s.text), selectFirst: true, placeholder: "Select site...", width: 200, onChange: v => this.onFieldValueChanged("site", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: categories, selectFirst: true, placeholder: "Select category...", width: 200, dropdownWidth: "500px", onChange: v => v[0] != "All" ? this.onFieldValueChanged("category", v) : this.state.query.delete("category") })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement("button", { onClick: () => this.getReport() }, "Get Report")),
                react.createElement("div", { className: "report-search-space" }),
                react.createElement("div", { className: "report-search-right" },
                    react.createElement(TableSearch, { parent: this }))),
            react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                react.createElement("div", { className: "pagination-info" },
                    react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                react.createElement("div", { className: "nomination-top-paginator" },
                    this.isSSHEUser ?
                        react.createElement(react.Fragment, null,
                            react.createElement(Select, { onChange: values => this.setState({ selectedStage: parseInt(values[0]) }), values: this.state.selectedStage ? [this.state.selectedStage.toString()] : (this.state.stage ? [this.state.stage.toString()] : null), options: this.getStages(), selectFirst: true, width: 200 }),
                            react.createElement("button", { onClick: this.changeStage }, "Save")) :
                        react.createElement(react.Fragment, null),
                    react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
            react.createElement(Table, { onDataLoaded: this.setReportData, parent: this, className: this.getClass(), apiUrl: "/api/reporting/nomination", columns: this.columns, getContextMenu: this.getContextMenu },
                this.state.stage == 1 || this.state.stage == 2 ?
                    react.createElement("div", { className: "nomination-top-cell" },
                        react.createElement("i", { className: "fas fa-trash-alt", onClick: () => this.excludeCards() })) :
                    react.createElement(react.Fragment, null),
                react.createElement(TableDefaultHeader, null)),
            react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                react.createElement("div", { className: "pagination-info" },
                    react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                react.createElement("div", null,
                    react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) })))));
    }
    offsetVote(row, offset) {
        let params = new Map();
        params.set("offset", offset.toString());
        http.fetch("/api/reporting/nomination/" + this.state.reportId + "/offsetvote/" + row.id, HttpMethod.put, params)
            .then(res => {
            if (res.status == "ok")
                this.setState({ updateTable: true });
            else
                this.handleError(res.errors[0].text);
        })
            .catch(() => this.handleError());
    }
    vote(row, set) {
        http.fetch("/api/reporting/nomination/" + this.state.reportId + "/" + (set ? "set" : "unset") + "vote/" + row.id, HttpMethod.put)
            .then(res => {
            if (res.status == "ok")
                this.setState({ updateTable: true });
            else
                this.handleError(res.errors[0].text);
        })
            .catch(() => this.handleError());
    }
    winner(row, set) {
        http.fetch("/api/reporting/nomination/" + this.state.reportId + "/" + (set ? "set" : "unset") + "winner/" + row.id, HttpMethod.put)
            .then(res => {
            if (res.status == "ok")
                this.setState({ updateTable: true });
            else
                this.handleError(res.errors[0].text);
        })
            .catch(() => this.handleError());
    }
    categorySelected(category) {
        let handleError = () => {
            this.setState({
                nominationSelectorVisible: false,
                errorVisible: true,
                errorMessage: Form.unknownError
            });
        };
        let params = new Map();
        params.set("category", category);
        http.fetch("/api/reporting/nomination/" + this.state.reportId + "/setcategory/" + this.state.nominationCardId, HttpMethod.put, params)
            .then(res => {
            if (res.status == "ok") {
                this.setState({
                    nominationSelectorVisible: false,
                    updateTable: true
                });
            }
            else
                handleError();
        })
            .catch(() => handleError());
    }
    showDetails(row) {
        this.setState({
            detailsLoading: true,
            detailsVisible: true
        });
        let handleError = () => {
            this.setState({
                detailsLoading: false,
                detailsVisible: false,
                errorVisible: true,
                errorMessage: "Failed to retrieve card data"
            });
        };
        http.fetch("/api/cards/" + row.id)
            .then(res => {
            if (res.status == "ok") {
                this.setState({
                    detailsLoading: false,
                    details: res.data
                });
            }
            else
                handleError();
        })
            .catch(() => handleError());
    }
    showNominationSelector(row) {
        this.setState({
            nominationSelectorVisible: true,
            nominationLoading: true,
            nominationCardId: row.id
        });
        let handleError = () => {
            this.setState({
                nominationLoading: false,
                nominationSelectorVisible: false,
                errorVisible: true,
                errorMessage: Form.unknownError
            });
        };
        http.fetch("/api/cards/" + row.id)
            .then(res => {
            if (res.status == "ok")
                this.setState({
                    nominationLoading: false,
                    nominationCategory: res.data.nominationCategory
                });
            else
                handleError();
        })
            .catch(() => handleError());
    }
    changePage(page) {
        this.setState({
            page,
            updateTable: true
        });
    }
    getReport() {
        this.setState({
            updateTable: true,
            query: this.state.query
        });
    }
    onFieldValueChanged(field, values) {
        this.state.query.set(field, values);
    }
    convertDate(date) {
        let parts = date.split("T")[0].split("-");
        return parts[1] + "/" + parts[2] + "/" + parts[0];
    }
    getStages() {
        return [
            { value: "1", text: "Stage 1" },
            { value: "2", text: "Stage 2" },
            { value: "3", text: "Stage 3" },
            { value: "4", text: "Stage 4", disabled: this.state.stage == 1 || this.state.stage == 2 },
            { value: "5", text: "Closed", disabled: this.state.stage == 1 || this.state.stage == 2 || this.state.stage == 3 }
        ];
    }
    getClass() {
        if (this.state.stage == 1 || this.state.stage == 2)
            return "nomination12";
        else if (this.state.stage == 3)
            return "nomination3";
        return "nomination";
    }
    getColumns() {
        let getColumn = (label, internalName = null, sortable = false, filterable = false, searchable = false, map = null) => {
            if (!internalName)
                internalName = label;
            let column = {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map
            };
            if (this.state.stage == 1 || this.state.stage == 2)
                column.onClick = row => row.selected = !row.selected;
            if (internalName == "nominationCategory") {
                if (this.state.stage == 3 && this.isVotingUser)
                    column.getAdditionalCellClass = row => row.stage3VoteMade ? "nomination-category-cell-voted" : "nomination-category-cell";
                else if (this.state.stage == 4 || this.state.stage == 5)
                    column.getAdditionalCellClass = row => row.isWinner ? "nomination-category-cell-winner" : "nomination-category-cell";
                else
                    column.getAdditionalCellClass = () => "nomination-category-cell";
                if (this.state.stage == 1 || this.state.stage == 2)
                    column.onDoubleClick = row => this.showNominationSelector(row);
                else if (this.state.stage == 3 && this.isVotingUser)
                    column.onDoubleClick = row => row.stage3VoteMade ? this.unsetVote(row) : this.setVote(row);
                else if (this.state.stage == 4 && this.isSSHEUser)
                    column.onDoubleClick = row => row.isWinner ? this.unsetWinner(row) : this.setWinner(row);
                else
                    column.onDoubleClick = row => this.showDetails(row);
            }
            else {
                column.getAdditionalCellClass = row => row.selected ? "nomination-cell-selected" : "";
                column.onDoubleClick = row => this.showDetails(row);
            }
            return column;
        };
        let columns = [
            getColumn("Description", "description", false, false, true),
            getColumn("Actions Taken", "actionsTaken", false, false, true),
            getColumn("Suggested Actions", "furtherActions", false, false, true),
            getColumn("Description (rus)", "descriptionRus", false, false, true),
            getColumn("Actions Taken (rus)", "actionsTakenRus", false, false, true),
            getColumn("Suggested Actions (rus)", "furtherActionsRus", false, false, true),
            getColumn("Nomination's Category", "nominationCategory", true, true, true)
        ];
        if (this.state.stage == 1 || this.state.stage == 2) {
            let column = getColumn("", "id");
            column.map = row => react.createElement("input", { type: "checkbox", checked: !!row.selected });
            columns.unshift(column);
        }
        else if ((this.state.stage == 3 && this.isSSHEUser) || this.state.stage == 4) {
            let column = getColumn("Votes S2", "votesNumberStage3", true, true, true);
            column.getAdditionalCellClass = row => (this.state.stage == 4 && row.isWinner) ? "nomination-category-cell-winner" : "nomination-category-cell";
            columns.push(column);
        }
        return columns;
    }
    handleError(error = null) {
        this.setState({
            errorVisible: true,
            errorMessage: error ? error : Form.unknownError
        });
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/reporting/NominatedCards.tsx





class NominatedCards extends TableContainer {
    constructor(props) {
        super(props);
        this.getContextMenu = (row) => {
            return [
                {
                    label: "Details",
                    icon: react.createElement("i", { className: "fas fa-info-circle" }),
                    action: () => this.showDetails(row)
                },
                {
                    label: "Edit",
                    icon: react.createElement("i", { className: "fas fa-edit" }),
                    action: () => location.href = "/index?id=" + row.id
                }
            ];
        };
        let state = this.state;
        state.showDatePicker = false;
        state.dateFrom = DateRangePicker.getRange("cm")[0];
        state.pageTitle = "Nomination report (Nominated cards)";
        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }
    render() {
        return (react.createElement("div", null,
            react.createElement(Modal, { height: 270, header: "Select range", visible: this.state.showDatePicker, onClose: () => this.setState({ showDatePicker: false }) },
                react.createElement(DateRangePicker, { onChange: (from, to) => this.dateRangeSelected(from, to) })),
            react.createElement(Modal, { visible: this.state.detailsVisible, loading: this.state.detailsLoading, width: 900, onClose: () => this.setState({ detailsVisible: false }) },
                react.createElement(CardDetails, { card: this.state.details })),
            react.createElement(ModalError, { visible: this.state.errorVisible, errors: [this.state.errorMessage], onClose: () => this.setState({ errorVisible: false }) }),
            react.createElement("div", { className: "report-search-area" },
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.sites.map(s => s.text), multiple: true, placeholder: "Select sites...", width: 200, onChange: v => this.onFieldValueChanged("sites", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.companies.map(s => s.text), multiple: true, placeholder: "Select companies...", width: 200, onChange: v => this.onFieldValueChanged("companies", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.departments.map(s => s.text), multiple: true, placeholder: "Select departments...", width: 200, onChange: v => this.onFieldValueChanged("departments", v) })),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement(Select, { options: app.nominationCategories, multiple: true, placeholder: "Select categories...", width: 200, dropdownWidth: "500px", onChange: v => this.onFieldValueChanged("categories", v) })),
                react.createElement("div", { className: "report-search-left nopadding" },
                    react.createElement("input", { type: "date", placeholder: "From...", value: this.state.dateFrom, onChange: e => this.onDateChanged(e.currentTarget.value, "from") }),
                    "\u00A0-\u00A0",
                    react.createElement("input", { type: "date", placeholder: "To...", value: this.state.dateTo, onChange: e => this.onDateChanged(e.currentTarget.value, "to") }),
                    " \u00A0"),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement("button", { className: "date-picker-button", onClick: () => this.setState({ showDatePicker: true }) }, "...")),
                react.createElement("div", { className: "report-search-left" },
                    react.createElement("button", { onClick: () => this.getReport() }, "Get Report")),
                react.createElement("div", { className: "report-search-space" }),
                react.createElement("div", { className: "report-search-right" },
                    react.createElement(TableSearch, { parent: this }))),
            react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                react.createElement("div", { className: "pagination-info" },
                    react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                react.createElement("div", null,
                    react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
            react.createElement(Table, { parent: this, className: "nominatedcards", apiUrl: "/api/reporting/nominatedcards", columns: this.getColumns(), getContextMenu: this.getContextMenu },
                react.createElement("div", { className: "nominatedcards-top-cell" },
                    react.createElement(react_switch.default, { onChange: () => this.toggleLang(), checked: this.state.lang == Language.rus, uncheckedIcon: react.createElement("div", { className: "switch-label" }, "eng"), checkedIcon: react.createElement("div", { className: "switch-label" }, "rus"), height: 25, width: 60 })),
                react.createElement(TableDefaultHeader, null)),
            react.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                react.createElement("div", { className: "pagination-info" },
                    react.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                react.createElement("div", null,
                    react.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) })))));
    }
    showDetails(row) {
        this.setState({
            detailsLoading: true,
            detailsVisible: true
        });
        let handleError = () => {
            this.setState({
                detailsLoading: false,
                detailsVisible: false,
                errorVisible: true,
                errorMessage: "Failed to retrieve card data"
            });
        };
        http.fetch("/api/cards/" + row.id)
            .then(res => {
            if (res.status == "ok") {
                this.setState({
                    detailsLoading: false,
                    details: res.data
                });
            }
            else
                handleError();
        })
            .catch(() => handleError());
    }
    toggleLang() {
        let lang = Language.rus;
        if (this.state.lang == Language.rus)
            lang = Language.eng;
        this.setState({ lang });
    }
    changePage(page) {
        this.setState({
            page,
            updateTable: true
        });
    }
    getReport() {
        this.setState({
            updateTable: true,
            query: this.state.query
        });
    }
    onDateChanged(value, field) {
        if (field == "from")
            this.setState({ dateFrom: value });
        else if (field == "to")
            this.setState({ dateTo: value });
        this.onFieldValueChanged(field, [value]);
    }
    onFieldValueChanged(field, values) {
        this.state.query.set(field, values);
    }
    dateRangeSelected(from, to) {
        this.onFieldValueChanged("from", [from]);
        if (to)
            this.onFieldValueChanged("to", [to]);
        this.setState({
            dateFrom: from,
            dateTo: to,
            showDatePicker: false
        });
    }
    getColumns() {
        let getColumn = (label, internalName = null, sortable = false, filterable = false, searchable = false, map = null) => {
            if (!internalName)
                internalName = label;
            let column = {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map
            };
            column.onDoubleClick = row => this.showDetails(row);
            return column;
        };
        let convertStringList = (items) => {
            let list = [];
            for (let i = 0; i < items.length; i++) {
                list.push(react.createElement(react.Fragment, null,
                    items[i],
                    ";"));
                if (i != items.length - 1)
                    list.push(react.createElement("br", null));
            }
            return list;
        };
        let getStringByLang = (text, lang) => react.createElement(react.Fragment, null, text ? text.split("{-DELIM-}")[lang == Language.rus ? 1 : 0] : "");
        let nomination = getColumn("Nomination", "nominationCategory", true, true, true);
        nomination.getAdditionalCellClass = (row) => row.nominationCategory ? "tv-cell-nominated-card" : "";
        return [
            getColumn("Card #", "id", true, false, true),
            getColumn("Date", "date", true, true, false, row => react.createElement("span", null, utility.convertDate(row.date, true))),
            getColumn("Site", "site", true, true, true),
            getColumn("Company", "company", true, true, true),
            getColumn("Department", "department", true, true, true),
            getColumn("Name", "employee", true, false, true),
            getColumn("Report Type", "reportType", true, true, true),
            getColumn("Life Saving Actions", "lifeSavingActions", true, true, true),
            getColumn("Categories", "hazardID", false, true, true, row => convertStringList(row.hazardID)),
            getColumn("Safe Choice Categories", "safeChoice", false, true, true, row => convertStringList(row.safeChoice)),
            getColumn("Description", "description", false, false, true, row => getStringByLang(row.description, this.state.lang)),
            getColumn("Actions Taken", "actionsTaken", false, false, true, row => getStringByLang(row.actionsTaken, this.state.lang)),
            getColumn("Location", "location", false, false, true, row => getStringByLang(row.location, this.state.lang)),
            getColumn("Suggested Actions", "furtherActions", false, false, true, row => getStringByLang(row.furtherActions, this.state.lang)),
            nomination
        ];
    }
}

;// CONCATENATED MODULE: ./wwwroot/ts/pages/mgmt/ManagementApp.tsx



























class ManagementAppSettings {
    constructor() {
        this.accessDeniedUrl = "/v2/mgmt/accessdenied";
        this.fetchOptions = (rows) => rows.map(row => ({ value: row.id, text: row.name }));
    }
    fillProps() {
        this.accessPolicies = this.getAccessPolicies();
        this.fetch = this.getFetch();
        this.routes = this.getRoutes();
    }
    getAccessPolicies() {
        let policies = new Map();
        policies.set("administrator", () => UserService.hasRole(UserRole.administrator));
        policies.set("siteAdministrator", () => UserService.hasRole(UserRole.administrator | UserRole.siteAdministrator));
        policies.set("nomination", () => UserService.hasRole(UserRole.administrator | UserRole.SSHEUser | UserRole.votingUser));
        policies.set("nominationSSHEUser", () => UserService.hasRole(UserRole.administrator | UserRole.SSHEUser));
        policies.set("nominationVotingUser", () => UserService.hasRole(UserRole.administrator | UserRole.votingUser));
        return policies;
    }
    getMenu() {
        let items = [];
        if (UserService.correspondsPolicy("administrator"))
            items.push({ label: "Lists", children: this.getLists() });
        else
            items.push({ label: "Employees (NGH)", link: "/v2/mgmt/employees" });
        items.push({ label: "NGH Cards", link: "/v2/mgmt/cards" });
        items.push({ label: "Reporting", children: this.getReports() });
        items.push({ label: "Manuals" });
        return items;
    }
    getLists() {
        let lists = [];
        lists.push({ label: "Portal Users", link: "/v2/mgmt/users" });
        lists.push({ label: "Employees (NGH)", link: "/v2/mgmt/employees" });
        lists.push({ label: "Companies", link: "/v2/mgmt/companies" });
        lists.push({ label: "Departments", link: "/v2/mgmt/departments" });
        lists.push({ label: "Sites", link: "/v2/mgmt/sites" });
        return lists;
    }
    getReports() {
        let reports = [];
        reports.push({ label: "Nomination report (Nominated cards)", link: "/v2/mgmt/reporting/nominatedcards" });
        if (UserService.correspondsPolicy("nomination"))
            reports.push({ label: "Nomination report (Voting)", link: "/v2/mgmt/reporting/nomination" });
        reports.push({ label: "Close-out report (action items data)", link: "/v2/mgmt/reporting/closeout" });
        reports.push({ label: "User report (company or department participation)", link: "/v2/mgmt/reporting/cord" });
        reports.push({ label: "User report (by Observer)", link: "/v2/mgmt/reporting/observer" });
        reports.push({ label: "Participation report", link: "/v2/mgmt/reporting/participation" });
        reports.push({ label: "OIMS System 5-4 KPIs Data", link: "/v2/mgmt/reporting/oims" });
        reports.push({ label: "Graphics", link: "/v2/mgmt/reporting/graphics" });
        return reports;
    }
    getRoutes() {
        return [
            { path: "/v2/mgmt/cards", component: react.createElement(Cards, { app: this }), exact: true },
            { path: "/v2/mgmt/sites", component: react.createElement(Sites, { app: this }), exact: true },
            { path: "/v2/mgmt/sites/edit/:id", component: react.createElement(SitesEditForm, null), exact: false },
            { path: "/v2/mgmt/sites/new", component: react.createElement(SitesNewForm, null), exact: false },
            { path: "/v2/mgmt/departments", component: react.createElement(Departments, { app: this }), exact: true },
            { path: "/v2/mgmt/departments/edit/:id", component: react.createElement(DepartmentsEditForm, null), exact: false },
            { path: "/v2/mgmt/departments/new", component: react.createElement(DepartmentsNewForm, null), exact: false },
            { path: "/v2/mgmt/companies", component: react.createElement(Companies, { app: this }), exact: true },
            { path: "/v2/mgmt/companies/edit/:id", component: react.createElement(CompaniesEditForm, null), exact: false },
            { path: "/v2/mgmt/companies/new", component: react.createElement(CompaniesNewForm, null), exact: false },
            { path: "/v2/mgmt/users", component: react.createElement(Users, { app: this }), exact: true },
            { path: "/v2/mgmt/users/edit/:id", component: react.createElement(UsersEditForm, null), exact: false },
            { path: "/v2/mgmt/users/new", component: react.createElement(UsersNewForm, null), exact: false },
            { path: "/v2/mgmt/employees", component: react.createElement(Employees, { app: this }), exact: true },
            { path: "/v2/mgmt/employees/edit/:id", component: react.createElement(EmployeesEditForm, null), exact: false },
            { path: "/v2/mgmt/employees/new", component: react.createElement(EmployeesNewForm, null), exact: false },
            { path: "/v2/mgmt/reporting/nominatedcards", component: react.createElement(NominatedCards, { app: this }), exact: true },
            { path: "/v2/mgmt/reporting/nomination", component: react.createElement(Nomination, { app: this }), exact: true },
            { path: "/v2/mgmt/reporting/closeout", component: react.createElement(Closeout, { app: this }), exact: true },
            { path: "/v2/mgmt/reporting/cord", component: react.createElement(Cord, { app: this }), exact: true },
            { path: "/v2/mgmt/reporting/observer", component: react.createElement(Observer, { app: this }), exact: true },
            { path: "/v2/mgmt/reporting/oims", component: react.createElement(OIMS, { app: this }), exact: true },
            { path: "/v2/mgmt/reporting/participation", component: react.createElement(Participation, { app: this }), exact: true },
            { path: "/v2/mgmt/reporting/graphics", component: react.createElement(Graphics, null), exact: true }
        ];
    }
    getFetch() {
        return [
            {
                url: "/api/sites?rowsPerPage=1000",
                prop: "sitesPromise",
                map: r => this.fetchOptions(r.data.rows),
                after: () => this.sitesPromise.then(s => this.sites = s)
            },
            {
                url: "/api/companies?rowsPerPage=1000",
                prop: "companiesPromise",
                map: r => this.fetchOptions(r.data.rows),
                after: () => this.companiesPromise.then(c => this.companies = c)
            },
            {
                url: "/api/departments?rowsPerPage=1000",
                prop: "departmentsPromise",
                map: r => this.fetchOptions(r.data.rows),
                after: () => this.departmentsPromise.then(d => this.departments = d)
            },
            {
                url: "/api/users/current",
                prop: "currentUserPromise",
                map: r => r.data,
                after: () => this.currentUserPromise.then(u => this.currentUser = u)
            },
            {
                url: "/api/nominations/categories?rowsPerPage=1000",
                prop: "nominationCategoriesPromise",
                map: r => r.data,
                after: () => this.nominationCategoriesPromise.then(n => this.nominationCategories = n)
            }
        ];
    }
}
let app = new ManagementAppSettings();
app.fillProps();
react_dom.render(react.createElement(ManagementApp, { app: app }), document.body);


/***/ }),

/***/ 679:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var reactIs = __webpack_require__(296);

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var REACT_STATICS = {
  childContextTypes: true,
  contextType: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromError: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true
};
var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};
var FORWARD_REF_STATICS = {
  '$$typeof': true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var MEMO_STATICS = {
  '$$typeof': true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};
var TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

function getStatics(component) {
  // React v16.11 and below
  if (reactIs.isMemo(component)) {
    return MEMO_STATICS;
  } // React v16.12 and above


  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
}

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = Object.prototype;
function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
  if (typeof sourceComponent !== 'string') {
    // don't hoist over string (html) components
    if (objectPrototype) {
      var inheritedComponent = getPrototypeOf(sourceComponent);

      if (inheritedComponent && inheritedComponent !== objectPrototype) {
        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
      }
    }

    var keys = getOwnPropertyNames(sourceComponent);

    if (getOwnPropertySymbols) {
      keys = keys.concat(getOwnPropertySymbols(sourceComponent));
    }

    var targetStatics = getStatics(targetComponent);
    var sourceStatics = getStatics(sourceComponent);

    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];

      if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

        try {
          // Avoid failures from read-only properties
          defineProperty(targetComponent, key, descriptor);
        } catch (e) {}
      }
    }
  }

  return targetComponent;
}

module.exports = hoistNonReactStatics;


/***/ }),

/***/ 103:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}exports.AsyncMode=l;exports.ConcurrentMode=m;exports.ContextConsumer=k;exports.ContextProvider=h;exports.Element=c;exports.ForwardRef=n;exports.Fragment=e;exports.Lazy=t;exports.Memo=r;exports.Portal=d;
exports.Profiler=g;exports.StrictMode=f;exports.Suspense=p;exports.isAsyncMode=function(a){return A(a)||z(a)===l};exports.isConcurrentMode=A;exports.isContextConsumer=function(a){return z(a)===k};exports.isContextProvider=function(a){return z(a)===h};exports.isElement=function(a){return"object"===typeof a&&null!==a&&a.$$typeof===c};exports.isForwardRef=function(a){return z(a)===n};exports.isFragment=function(a){return z(a)===e};exports.isLazy=function(a){return z(a)===t};
exports.isMemo=function(a){return z(a)===r};exports.isPortal=function(a){return z(a)===d};exports.isProfiler=function(a){return z(a)===g};exports.isStrictMode=function(a){return z(a)===f};exports.isSuspense=function(a){return z(a)===p};
exports.isValidElementType=function(a){return"string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};exports.typeOf=z;


/***/ }),

/***/ 296:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (true) {
  module.exports = __webpack_require__(103);
} else {}


/***/ }),

/***/ 418:
/***/ ((module) => {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),

/***/ 779:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isarray = __webpack_require__(173)

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp
module.exports.parse = parse
module.exports.compile = compile
module.exports.tokensToFunction = tokensToFunction
module.exports.tokensToRegExp = tokensToRegExp

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var defaultDelimiter = options && options.delimiter || '/'
  var res

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      continue
    }

    var next = str[index]
    var prefix = res[2]
    var name = res[3]
    var capture = res[4]
    var group = res[5]
    var modifier = res[6]
    var asterisk = res[7]

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
    }

    var partial = prefix != null && next != null && next !== prefix
    var repeat = modifier === '+' || modifier === '*'
    var optional = modifier === '?' || modifier === '*'
    var delimiter = res[2] || defaultDelimiter
    var pattern = capture || group

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    })
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index)
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path)
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options), options)
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens, options) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options))
    }
  }

  return function (obj, opts) {
    var path = ''
    var data = obj || {}
    var options = opts || {}
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token

        continue
      }

      var value = data[token.name]
      var segment

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value)

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options && options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      })
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options)
    keys = []
  }

  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var route = ''

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var prefix = escapeString(token.prefix)
      var capture = '(?:' + token.pattern + ')'

      keys.push(token)

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*'
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?'
        } else {
          capture = prefix + '(' + capture + ')?'
        }
      } else {
        capture = prefix + '(' + capture + ')'
      }

      route += capture
    }
  }

  var delimiter = escapeString(options.delimiter || '/')
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?'
  }

  if (end) {
    route += '$'
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)'
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options)
    keys = []
  }

  options = options || {}

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}


/***/ }),

/***/ 173:
/***/ ((module) => {

module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ 703:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = __webpack_require__(414);

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ 697:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (false) { var throwOnDirectAccess, ReactIs; } else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(703)();
}


/***/ }),

/***/ 414:
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ 448:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/** @license React v17.0.1
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/*
 Modernizr 3.0.0pre (Custom Build) | MIT
*/
var aa=__webpack_require__(294),m=__webpack_require__(418),r=__webpack_require__(840);function y(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return"Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}if(!aa)throw Error(y(227));var ba=new Set,ca={};function da(a,b){ea(a,b);ea(a+"Capture",b)}
function ea(a,b){ca[a]=b;for(a=0;a<b.length;a++)ba.add(b[a])}
var fa=!("undefined"===typeof window||"undefined"===typeof window.document||"undefined"===typeof window.document.createElement),ha=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,ia=Object.prototype.hasOwnProperty,
ja={},ka={};function la(a){if(ia.call(ka,a))return!0;if(ia.call(ja,a))return!1;if(ha.test(a))return ka[a]=!0;ja[a]=!0;return!1}function ma(a,b,c,d){if(null!==c&&0===c.type)return!1;switch(typeof b){case "function":case "symbol":return!0;case "boolean":if(d)return!1;if(null!==c)return!c.acceptsBooleans;a=a.toLowerCase().slice(0,5);return"data-"!==a&&"aria-"!==a;default:return!1}}
function na(a,b,c,d){if(null===b||"undefined"===typeof b||ma(a,b,c,d))return!0;if(d)return!1;if(null!==c)switch(c.type){case 3:return!b;case 4:return!1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return!1}function B(a,b,c,d,e,f,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=d;this.attributeNamespace=e;this.mustUseProperty=c;this.propertyName=a;this.type=b;this.sanitizeURL=f;this.removeEmptyString=g}var D={};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){D[a]=new B(a,0,!1,a,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];D[b]=new B(b,1,!1,a[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(a){D[a]=new B(a,2,!1,a.toLowerCase(),null,!1,!1)});
["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){D[a]=new B(a,2,!1,a,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){D[a]=new B(a,3,!1,a.toLowerCase(),null,!1,!1)});
["checked","multiple","muted","selected"].forEach(function(a){D[a]=new B(a,3,!0,a,null,!1,!1)});["capture","download"].forEach(function(a){D[a]=new B(a,4,!1,a,null,!1,!1)});["cols","rows","size","span"].forEach(function(a){D[a]=new B(a,6,!1,a,null,!1,!1)});["rowSpan","start"].forEach(function(a){D[a]=new B(a,5,!1,a.toLowerCase(),null,!1,!1)});var oa=/[\-:]([a-z])/g;function pa(a){return a[1].toUpperCase()}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(oa,
pa);D[b]=new B(b,1,!1,a,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(oa,pa);D[b]=new B(b,1,!1,a,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(oa,pa);D[b]=new B(b,1,!1,a,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(a){D[a]=new B(a,1,!1,a.toLowerCase(),null,!1,!1)});
D.xlinkHref=new B("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(a){D[a]=new B(a,1,!1,a.toLowerCase(),null,!0,!0)});
function qa(a,b,c,d){var e=D.hasOwnProperty(b)?D[b]:null;var f=null!==e?0===e.type:d?!1:!(2<b.length)||"o"!==b[0]&&"O"!==b[0]||"n"!==b[1]&&"N"!==b[1]?!1:!0;f||(na(b,c,e,d)&&(c=null),d||null===e?la(b)&&(null===c?a.removeAttribute(b):a.setAttribute(b,""+c)):e.mustUseProperty?a[e.propertyName]=null===c?3===e.type?!1:"":c:(b=e.attributeName,d=e.attributeNamespace,null===c?a.removeAttribute(b):(e=e.type,c=3===e||4===e&&!0===c?"":""+c,d?a.setAttributeNS(d,b,c):a.setAttribute(b,c))))}
var ra=aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,sa=60103,ta=60106,ua=60107,wa=60108,xa=60114,ya=60109,za=60110,Aa=60112,Ba=60113,Ca=60120,Da=60115,Ea=60116,Fa=60121,Ga=60128,Ha=60129,Ia=60130,Ja=60131;
if("function"===typeof Symbol&&Symbol.for){var E=Symbol.for;sa=E("react.element");ta=E("react.portal");ua=E("react.fragment");wa=E("react.strict_mode");xa=E("react.profiler");ya=E("react.provider");za=E("react.context");Aa=E("react.forward_ref");Ba=E("react.suspense");Ca=E("react.suspense_list");Da=E("react.memo");Ea=E("react.lazy");Fa=E("react.block");E("react.scope");Ga=E("react.opaque.id");Ha=E("react.debug_trace_mode");Ia=E("react.offscreen");Ja=E("react.legacy_hidden")}
var Ka="function"===typeof Symbol&&Symbol.iterator;function La(a){if(null===a||"object"!==typeof a)return null;a=Ka&&a[Ka]||a["@@iterator"];return"function"===typeof a?a:null}var Ma;function Na(a){if(void 0===Ma)try{throw Error();}catch(c){var b=c.stack.trim().match(/\n( *(at )?)/);Ma=b&&b[1]||""}return"\n"+Ma+a}var Oa=!1;
function Pa(a,b){if(!a||Oa)return"";Oa=!0;var c=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(b)if(b=function(){throw Error();},Object.defineProperty(b.prototype,"props",{set:function(){throw Error();}}),"object"===typeof Reflect&&Reflect.construct){try{Reflect.construct(b,[])}catch(k){var d=k}Reflect.construct(a,[],b)}else{try{b.call()}catch(k){d=k}a.call(b.prototype)}else{try{throw Error();}catch(k){d=k}a()}}catch(k){if(k&&d&&"string"===typeof k.stack){for(var e=k.stack.split("\n"),
f=d.stack.split("\n"),g=e.length-1,h=f.length-1;1<=g&&0<=h&&e[g]!==f[h];)h--;for(;1<=g&&0<=h;g--,h--)if(e[g]!==f[h]){if(1!==g||1!==h){do if(g--,h--,0>h||e[g]!==f[h])return"\n"+e[g].replace(" at new "," at ");while(1<=g&&0<=h)}break}}}finally{Oa=!1,Error.prepareStackTrace=c}return(a=a?a.displayName||a.name:"")?Na(a):""}
function Qa(a){switch(a.tag){case 5:return Na(a.type);case 16:return Na("Lazy");case 13:return Na("Suspense");case 19:return Na("SuspenseList");case 0:case 2:case 15:return a=Pa(a.type,!1),a;case 11:return a=Pa(a.type.render,!1),a;case 22:return a=Pa(a.type._render,!1),a;case 1:return a=Pa(a.type,!0),a;default:return""}}
function Ra(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case ua:return"Fragment";case ta:return"Portal";case xa:return"Profiler";case wa:return"StrictMode";case Ba:return"Suspense";case Ca:return"SuspenseList"}if("object"===typeof a)switch(a.$$typeof){case za:return(a.displayName||"Context")+".Consumer";case ya:return(a._context.displayName||"Context")+".Provider";case Aa:var b=a.render;b=b.displayName||b.name||"";
return a.displayName||(""!==b?"ForwardRef("+b+")":"ForwardRef");case Da:return Ra(a.type);case Fa:return Ra(a._render);case Ea:b=a._payload;a=a._init;try{return Ra(a(b))}catch(c){}}return null}function Sa(a){switch(typeof a){case "boolean":case "number":case "object":case "string":case "undefined":return a;default:return""}}function Ta(a){var b=a.type;return(a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
function Ua(a){var b=Ta(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"undefined"!==typeof c&&"function"===typeof c.get&&"function"===typeof c.set){var e=c.get,f=c.set;Object.defineProperty(a,b,{configurable:!0,get:function(){return e.call(this)},set:function(a){d=""+a;f.call(this,a)}});Object.defineProperty(a,b,{enumerable:c.enumerable});return{getValue:function(){return d},setValue:function(a){d=""+a},stopTracking:function(){a._valueTracker=
null;delete a[b]}}}}function Va(a){a._valueTracker||(a._valueTracker=Ua(a))}function Wa(a){if(!a)return!1;var b=a._valueTracker;if(!b)return!0;var c=b.getValue();var d="";a&&(d=Ta(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),!0):!1}function Xa(a){a=a||("undefined"!==typeof document?document:void 0);if("undefined"===typeof a)return null;try{return a.activeElement||a.body}catch(b){return a.body}}
function Ya(a,b){var c=b.checked;return m({},b,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:null!=c?c:a._wrapperState.initialChecked})}function Za(a,b){var c=null==b.defaultValue?"":b.defaultValue,d=null!=b.checked?b.checked:b.defaultChecked;c=Sa(null!=b.value?b.value:c);a._wrapperState={initialChecked:d,initialValue:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value}}function $a(a,b){b=b.checked;null!=b&&qa(a,"checked",b,!1)}
function ab(a,b){$a(a,b);var c=Sa(b.value),d=b.type;if(null!=c)if("number"===d){if(0===c&&""===a.value||a.value!=c)a.value=""+c}else a.value!==""+c&&(a.value=""+c);else if("submit"===d||"reset"===d){a.removeAttribute("value");return}b.hasOwnProperty("value")?bb(a,b.type,c):b.hasOwnProperty("defaultValue")&&bb(a,b.type,Sa(b.defaultValue));null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked)}
function cb(a,b,c){if(b.hasOwnProperty("value")||b.hasOwnProperty("defaultValue")){var d=b.type;if(!("submit"!==d&&"reset"!==d||void 0!==b.value&&null!==b.value))return;b=""+a._wrapperState.initialValue;c||b===a.value||(a.value=b);a.defaultValue=b}c=a.name;""!==c&&(a.name="");a.defaultChecked=!!a._wrapperState.initialChecked;""!==c&&(a.name=c)}
function bb(a,b,c){if("number"!==b||Xa(a.ownerDocument)!==a)null==c?a.defaultValue=""+a._wrapperState.initialValue:a.defaultValue!==""+c&&(a.defaultValue=""+c)}function db(a){var b="";aa.Children.forEach(a,function(a){null!=a&&(b+=a)});return b}function eb(a,b){a=m({children:void 0},b);if(b=db(b.children))a.children=b;return a}
function fb(a,b,c,d){a=a.options;if(b){b={};for(var e=0;e<c.length;e++)b["$"+c[e]]=!0;for(c=0;c<a.length;c++)e=b.hasOwnProperty("$"+a[c].value),a[c].selected!==e&&(a[c].selected=e),e&&d&&(a[c].defaultSelected=!0)}else{c=""+Sa(c);b=null;for(e=0;e<a.length;e++){if(a[e].value===c){a[e].selected=!0;d&&(a[e].defaultSelected=!0);return}null!==b||a[e].disabled||(b=a[e])}null!==b&&(b.selected=!0)}}
function gb(a,b){if(null!=b.dangerouslySetInnerHTML)throw Error(y(91));return m({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})}function hb(a,b){var c=b.value;if(null==c){c=b.children;b=b.defaultValue;if(null!=c){if(null!=b)throw Error(y(92));if(Array.isArray(c)){if(!(1>=c.length))throw Error(y(93));c=c[0]}b=c}null==b&&(b="");c=b}a._wrapperState={initialValue:Sa(c)}}
function ib(a,b){var c=Sa(b.value),d=Sa(b.defaultValue);null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&a.defaultValue!==c&&(a.defaultValue=c));null!=d&&(a.defaultValue=""+d)}function jb(a){var b=a.textContent;b===a._wrapperState.initialValue&&""!==b&&null!==b&&(a.value=b)}var kb={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};
function lb(a){switch(a){case "svg":return"http://www.w3.org/2000/svg";case "math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function mb(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?lb(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}
var nb,ob=function(a){return"undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)})}:a}(function(a,b){if(a.namespaceURI!==kb.svg||"innerHTML"in a)a.innerHTML=b;else{nb=nb||document.createElement("div");nb.innerHTML="<svg>"+b.valueOf().toString()+"</svg>";for(b=nb.firstChild;a.firstChild;)a.removeChild(a.firstChild);for(;b.firstChild;)a.appendChild(b.firstChild)}});
function pb(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&3===c.nodeType){c.nodeValue=b;return}}a.textContent=b}
var qb={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,
floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},rb=["Webkit","ms","Moz","O"];Object.keys(qb).forEach(function(a){rb.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);qb[b]=qb[a]})});function sb(a,b,c){return null==b||"boolean"===typeof b||""===b?"":c||"number"!==typeof b||0===b||qb.hasOwnProperty(a)&&qb[a]?(""+b).trim():b+"px"}
function tb(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--"),e=sb(c,b[c],d);"float"===c&&(c="cssFloat");d?a.setProperty(c,e):a[c]=e}}var ub=m({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});
function vb(a,b){if(b){if(ub[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML))throw Error(y(137,a));if(null!=b.dangerouslySetInnerHTML){if(null!=b.children)throw Error(y(60));if(!("object"===typeof b.dangerouslySetInnerHTML&&"__html"in b.dangerouslySetInnerHTML))throw Error(y(61));}if(null!=b.style&&"object"!==typeof b.style)throw Error(y(62));}}
function wb(a,b){if(-1===a.indexOf("-"))return"string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return!1;default:return!0}}function xb(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return 3===a.nodeType?a.parentNode:a}var yb=null,zb=null,Ab=null;
function Bb(a){if(a=Cb(a)){if("function"!==typeof yb)throw Error(y(280));var b=a.stateNode;b&&(b=Db(b),yb(a.stateNode,a.type,b))}}function Eb(a){zb?Ab?Ab.push(a):Ab=[a]:zb=a}function Fb(){if(zb){var a=zb,b=Ab;Ab=zb=null;Bb(a);if(b)for(a=0;a<b.length;a++)Bb(b[a])}}function Gb(a,b){return a(b)}function Hb(a,b,c,d,e){return a(b,c,d,e)}function Ib(){}var Jb=Gb,Kb=!1,Lb=!1;function Mb(){if(null!==zb||null!==Ab)Ib(),Fb()}
function Nb(a,b,c){if(Lb)return a(b,c);Lb=!0;try{return Jb(a,b,c)}finally{Lb=!1,Mb()}}
function Ob(a,b){var c=a.stateNode;if(null===c)return null;var d=Db(c);if(null===d)return null;c=d[b];a:switch(b){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":case "onMouseEnter":(d=!d.disabled)||(a=a.type,d=!("button"===a||"input"===a||"select"===a||"textarea"===a));a=!d;break a;default:a=!1}if(a)return null;if(c&&"function"!==
typeof c)throw Error(y(231,b,typeof c));return c}var Pb=!1;if(fa)try{var Qb={};Object.defineProperty(Qb,"passive",{get:function(){Pb=!0}});window.addEventListener("test",Qb,Qb);window.removeEventListener("test",Qb,Qb)}catch(a){Pb=!1}function Rb(a,b,c,d,e,f,g,h,k){var l=Array.prototype.slice.call(arguments,3);try{b.apply(c,l)}catch(n){this.onError(n)}}var Sb=!1,Tb=null,Ub=!1,Vb=null,Wb={onError:function(a){Sb=!0;Tb=a}};function Xb(a,b,c,d,e,f,g,h,k){Sb=!1;Tb=null;Rb.apply(Wb,arguments)}
function Yb(a,b,c,d,e,f,g,h,k){Xb.apply(this,arguments);if(Sb){if(Sb){var l=Tb;Sb=!1;Tb=null}else throw Error(y(198));Ub||(Ub=!0,Vb=l)}}function Zb(a){var b=a,c=a;if(a.alternate)for(;b.return;)b=b.return;else{a=b;do b=a,0!==(b.flags&1026)&&(c=b.return),a=b.return;while(a)}return 3===b.tag?c:null}function $b(a){if(13===a.tag){var b=a.memoizedState;null===b&&(a=a.alternate,null!==a&&(b=a.memoizedState));if(null!==b)return b.dehydrated}return null}function ac(a){if(Zb(a)!==a)throw Error(y(188));}
function bc(a){var b=a.alternate;if(!b){b=Zb(a);if(null===b)throw Error(y(188));return b!==a?null:a}for(var c=a,d=b;;){var e=c.return;if(null===e)break;var f=e.alternate;if(null===f){d=e.return;if(null!==d){c=d;continue}break}if(e.child===f.child){for(f=e.child;f;){if(f===c)return ac(e),a;if(f===d)return ac(e),b;f=f.sibling}throw Error(y(188));}if(c.return!==d.return)c=e,d=f;else{for(var g=!1,h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling}if(!g){for(h=f.child;h;){if(h===
c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling}if(!g)throw Error(y(189));}}if(c.alternate!==d)throw Error(y(190));}if(3!==c.tag)throw Error(y(188));return c.stateNode.current===c?a:b}function cc(a){a=bc(a);if(!a)return null;for(var b=a;;){if(5===b.tag||6===b.tag)return b;if(b.child)b.child.return=b,b=b.child;else{if(b===a)break;for(;!b.sibling;){if(!b.return||b.return===a)return null;b=b.return}b.sibling.return=b.return;b=b.sibling}}return null}
function dc(a,b){for(var c=a.alternate;null!==b;){if(b===a||b===c)return!0;b=b.return}return!1}var ec,fc,gc,hc,ic=!1,jc=[],kc=null,lc=null,mc=null,nc=new Map,oc=new Map,pc=[],qc="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function rc(a,b,c,d,e){return{blockedOn:a,domEventName:b,eventSystemFlags:c|16,nativeEvent:e,targetContainers:[d]}}function sc(a,b){switch(a){case "focusin":case "focusout":kc=null;break;case "dragenter":case "dragleave":lc=null;break;case "mouseover":case "mouseout":mc=null;break;case "pointerover":case "pointerout":nc.delete(b.pointerId);break;case "gotpointercapture":case "lostpointercapture":oc.delete(b.pointerId)}}
function tc(a,b,c,d,e,f){if(null===a||a.nativeEvent!==f)return a=rc(b,c,d,e,f),null!==b&&(b=Cb(b),null!==b&&fc(b)),a;a.eventSystemFlags|=d;b=a.targetContainers;null!==e&&-1===b.indexOf(e)&&b.push(e);return a}
function uc(a,b,c,d,e){switch(b){case "focusin":return kc=tc(kc,a,b,c,d,e),!0;case "dragenter":return lc=tc(lc,a,b,c,d,e),!0;case "mouseover":return mc=tc(mc,a,b,c,d,e),!0;case "pointerover":var f=e.pointerId;nc.set(f,tc(nc.get(f)||null,a,b,c,d,e));return!0;case "gotpointercapture":return f=e.pointerId,oc.set(f,tc(oc.get(f)||null,a,b,c,d,e)),!0}return!1}
function vc(a){var b=wc(a.target);if(null!==b){var c=Zb(b);if(null!==c)if(b=c.tag,13===b){if(b=$b(c),null!==b){a.blockedOn=b;hc(a.lanePriority,function(){r.unstable_runWithPriority(a.priority,function(){gc(c)})});return}}else if(3===b&&c.stateNode.hydrate){a.blockedOn=3===c.tag?c.stateNode.containerInfo:null;return}}a.blockedOn=null}
function xc(a){if(null!==a.blockedOn)return!1;for(var b=a.targetContainers;0<b.length;){var c=yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null!==c)return b=Cb(c),null!==b&&fc(b),a.blockedOn=c,!1;b.shift()}return!0}function zc(a,b,c){xc(a)&&c.delete(b)}
function Ac(){for(ic=!1;0<jc.length;){var a=jc[0];if(null!==a.blockedOn){a=Cb(a.blockedOn);null!==a&&ec(a);break}for(var b=a.targetContainers;0<b.length;){var c=yc(a.domEventName,a.eventSystemFlags,b[0],a.nativeEvent);if(null!==c){a.blockedOn=c;break}b.shift()}null===a.blockedOn&&jc.shift()}null!==kc&&xc(kc)&&(kc=null);null!==lc&&xc(lc)&&(lc=null);null!==mc&&xc(mc)&&(mc=null);nc.forEach(zc);oc.forEach(zc)}
function Bc(a,b){a.blockedOn===b&&(a.blockedOn=null,ic||(ic=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,Ac)))}
function Cc(a){function b(b){return Bc(b,a)}if(0<jc.length){Bc(jc[0],a);for(var c=1;c<jc.length;c++){var d=jc[c];d.blockedOn===a&&(d.blockedOn=null)}}null!==kc&&Bc(kc,a);null!==lc&&Bc(lc,a);null!==mc&&Bc(mc,a);nc.forEach(b);oc.forEach(b);for(c=0;c<pc.length;c++)d=pc[c],d.blockedOn===a&&(d.blockedOn=null);for(;0<pc.length&&(c=pc[0],null===c.blockedOn);)vc(c),null===c.blockedOn&&pc.shift()}
function Dc(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;return c}var Ec={animationend:Dc("Animation","AnimationEnd"),animationiteration:Dc("Animation","AnimationIteration"),animationstart:Dc("Animation","AnimationStart"),transitionend:Dc("Transition","TransitionEnd")},Fc={},Gc={};
fa&&(Gc=document.createElement("div").style,"AnimationEvent"in window||(delete Ec.animationend.animation,delete Ec.animationiteration.animation,delete Ec.animationstart.animation),"TransitionEvent"in window||delete Ec.transitionend.transition);function Hc(a){if(Fc[a])return Fc[a];if(!Ec[a])return a;var b=Ec[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Gc)return Fc[a]=b[c];return a}
var Ic=Hc("animationend"),Jc=Hc("animationiteration"),Kc=Hc("animationstart"),Lc=Hc("transitionend"),Mc=new Map,Nc=new Map,Oc=["abort","abort",Ic,"animationEnd",Jc,"animationIteration",Kc,"animationStart","canplay","canPlay","canplaythrough","canPlayThrough","durationchange","durationChange","emptied","emptied","encrypted","encrypted","ended","ended","error","error","gotpointercapture","gotPointerCapture","load","load","loadeddata","loadedData","loadedmetadata","loadedMetadata","loadstart","loadStart",
"lostpointercapture","lostPointerCapture","playing","playing","progress","progress","seeking","seeking","stalled","stalled","suspend","suspend","timeupdate","timeUpdate",Lc,"transitionEnd","waiting","waiting"];function Pc(a,b){for(var c=0;c<a.length;c+=2){var d=a[c],e=a[c+1];e="on"+(e[0].toUpperCase()+e.slice(1));Nc.set(d,b);Mc.set(d,e);da(e,[d])}}var Qc=r.unstable_now;Qc();var F=8;
function Rc(a){if(0!==(1&a))return F=15,1;if(0!==(2&a))return F=14,2;if(0!==(4&a))return F=13,4;var b=24&a;if(0!==b)return F=12,b;if(0!==(a&32))return F=11,32;b=192&a;if(0!==b)return F=10,b;if(0!==(a&256))return F=9,256;b=3584&a;if(0!==b)return F=8,b;if(0!==(a&4096))return F=7,4096;b=4186112&a;if(0!==b)return F=6,b;b=62914560&a;if(0!==b)return F=5,b;if(a&67108864)return F=4,67108864;if(0!==(a&134217728))return F=3,134217728;b=805306368&a;if(0!==b)return F=2,b;if(0!==(1073741824&a))return F=1,1073741824;
F=8;return a}function Sc(a){switch(a){case 99:return 15;case 98:return 10;case 97:case 96:return 8;case 95:return 2;default:return 0}}function Tc(a){switch(a){case 15:case 14:return 99;case 13:case 12:case 11:case 10:return 98;case 9:case 8:case 7:case 6:case 4:case 5:return 97;case 3:case 2:case 1:return 95;case 0:return 90;default:throw Error(y(358,a));}}
function Uc(a,b){var c=a.pendingLanes;if(0===c)return F=0;var d=0,e=0,f=a.expiredLanes,g=a.suspendedLanes,h=a.pingedLanes;if(0!==f)d=f,e=F=15;else if(f=c&134217727,0!==f){var k=f&~g;0!==k?(d=Rc(k),e=F):(h&=f,0!==h&&(d=Rc(h),e=F))}else f=c&~g,0!==f?(d=Rc(f),e=F):0!==h&&(d=Rc(h),e=F);if(0===d)return 0;d=31-Vc(d);d=c&((0>d?0:1<<d)<<1)-1;if(0!==b&&b!==d&&0===(b&g)){Rc(b);if(e<=F)return b;F=e}b=a.entangledLanes;if(0!==b)for(a=a.entanglements,b&=d;0<b;)c=31-Vc(b),e=1<<c,d|=a[c],b&=~e;return d}
function Wc(a){a=a.pendingLanes&-1073741825;return 0!==a?a:a&1073741824?1073741824:0}function Xc(a,b){switch(a){case 15:return 1;case 14:return 2;case 12:return a=Yc(24&~b),0===a?Xc(10,b):a;case 10:return a=Yc(192&~b),0===a?Xc(8,b):a;case 8:return a=Yc(3584&~b),0===a&&(a=Yc(4186112&~b),0===a&&(a=512)),a;case 2:return b=Yc(805306368&~b),0===b&&(b=268435456),b}throw Error(y(358,a));}function Yc(a){return a&-a}function Zc(a){for(var b=[],c=0;31>c;c++)b.push(a);return b}
function $c(a,b,c){a.pendingLanes|=b;var d=b-1;a.suspendedLanes&=d;a.pingedLanes&=d;a=a.eventTimes;b=31-Vc(b);a[b]=c}var Vc=Math.clz32?Math.clz32:ad,bd=Math.log,cd=Math.LN2;function ad(a){return 0===a?32:31-(bd(a)/cd|0)|0}var dd=r.unstable_UserBlockingPriority,ed=r.unstable_runWithPriority,fd=!0;function gd(a,b,c,d){Kb||Ib();var e=hd,f=Kb;Kb=!0;try{Hb(e,a,b,c,d)}finally{(Kb=f)||Mb()}}function id(a,b,c,d){ed(dd,hd.bind(null,a,b,c,d))}
function hd(a,b,c,d){if(fd){var e;if((e=0===(b&4))&&0<jc.length&&-1<qc.indexOf(a))a=rc(null,a,b,c,d),jc.push(a);else{var f=yc(a,b,c,d);if(null===f)e&&sc(a,d);else{if(e){if(-1<qc.indexOf(a)){a=rc(f,a,b,c,d);jc.push(a);return}if(uc(f,a,b,c,d))return;sc(a,d)}jd(a,b,d,null,c)}}}}
function yc(a,b,c,d){var e=xb(d);e=wc(e);if(null!==e){var f=Zb(e);if(null===f)e=null;else{var g=f.tag;if(13===g){e=$b(f);if(null!==e)return e;e=null}else if(3===g){if(f.stateNode.hydrate)return 3===f.tag?f.stateNode.containerInfo:null;e=null}else f!==e&&(e=null)}}jd(a,b,d,e,c);return null}var kd=null,ld=null,md=null;
function nd(){if(md)return md;var a,b=ld,c=b.length,d,e="value"in kd?kd.value:kd.textContent,f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);return md=e.slice(a,1<d?1-d:void 0)}function od(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;10===a&&(a=13);return 32<=a||13===a?a:0}function pd(){return!0}function qd(){return!1}
function rd(a){function b(b,d,e,f,g){this._reactName=b;this._targetInst=e;this.type=d;this.nativeEvent=f;this.target=g;this.currentTarget=null;for(var c in a)a.hasOwnProperty(c)&&(b=a[c],this[c]=b?b(f):f[c]);this.isDefaultPrevented=(null!=f.defaultPrevented?f.defaultPrevented:!1===f.returnValue)?pd:qd;this.isPropagationStopped=qd;return this}m(b.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&
(a.returnValue=!1),this.isDefaultPrevented=pd)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=pd)},persist:function(){},isPersistent:pd});return b}
var sd={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},td=rd(sd),ud=m({},sd,{view:0,detail:0}),vd=rd(ud),wd,xd,yd,Ad=m({},ud,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:zd,button:0,buttons:0,relatedTarget:function(a){return void 0===a.relatedTarget?a.fromElement===a.srcElement?a.toElement:a.fromElement:a.relatedTarget},movementX:function(a){if("movementX"in
a)return a.movementX;a!==yd&&(yd&&"mousemove"===a.type?(wd=a.screenX-yd.screenX,xd=a.screenY-yd.screenY):xd=wd=0,yd=a);return wd},movementY:function(a){return"movementY"in a?a.movementY:xd}}),Bd=rd(Ad),Cd=m({},Ad,{dataTransfer:0}),Dd=rd(Cd),Ed=m({},ud,{relatedTarget:0}),Fd=rd(Ed),Gd=m({},sd,{animationName:0,elapsedTime:0,pseudoElement:0}),Hd=rd(Gd),Id=m({},sd,{clipboardData:function(a){return"clipboardData"in a?a.clipboardData:window.clipboardData}}),Jd=rd(Id),Kd=m({},sd,{data:0}),Ld=rd(Kd),Md={Esc:"Escape",
Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Nd={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",
119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Od={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Pd(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Od[a])?!!b[a]:!1}function zd(){return Pd}
var Qd=m({},ud,{key:function(a){if(a.key){var b=Md[a.key]||a.key;if("Unidentified"!==b)return b}return"keypress"===a.type?(a=od(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?Nd[a.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:zd,charCode:function(a){return"keypress"===a.type?od(a):0},keyCode:function(a){return"keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return"keypress"===
a.type?od(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}}),Rd=rd(Qd),Sd=m({},Ad,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Td=rd(Sd),Ud=m({},ud,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:zd}),Vd=rd(Ud),Wd=m({},sd,{propertyName:0,elapsedTime:0,pseudoElement:0}),Xd=rd(Wd),Yd=m({},Ad,{deltaX:function(a){return"deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},
deltaY:function(a){return"deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:0,deltaMode:0}),Zd=rd(Yd),$d=[9,13,27,32],ae=fa&&"CompositionEvent"in window,be=null;fa&&"documentMode"in document&&(be=document.documentMode);var ce=fa&&"TextEvent"in window&&!be,de=fa&&(!ae||be&&8<be&&11>=be),ee=String.fromCharCode(32),fe=!1;
function ge(a,b){switch(a){case "keyup":return-1!==$d.indexOf(b.keyCode);case "keydown":return 229!==b.keyCode;case "keypress":case "mousedown":case "focusout":return!0;default:return!1}}function he(a){a=a.detail;return"object"===typeof a&&"data"in a?a.data:null}var ie=!1;function je(a,b){switch(a){case "compositionend":return he(b);case "keypress":if(32!==b.which)return null;fe=!0;return ee;case "textInput":return a=b.data,a===ee&&fe?null:a;default:return null}}
function ke(a,b){if(ie)return"compositionend"===a||!ae&&ge(a,b)?(a=nd(),md=ld=kd=null,ie=!1,a):null;switch(a){case "paste":return null;case "keypress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "compositionend":return de&&"ko"!==b.locale?null:b.data;default:return null}}
var le={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function me(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return"input"===b?!!le[a.type]:"textarea"===b?!0:!1}function ne(a,b,c,d){Eb(d);b=oe(b,"onChange");0<b.length&&(c=new td("onChange","change",null,c,d),a.push({event:c,listeners:b}))}var pe=null,qe=null;function re(a){se(a,0)}function te(a){var b=ue(a);if(Wa(b))return a}
function ve(a,b){if("change"===a)return b}var we=!1;if(fa){var xe;if(fa){var ye="oninput"in document;if(!ye){var ze=document.createElement("div");ze.setAttribute("oninput","return;");ye="function"===typeof ze.oninput}xe=ye}else xe=!1;we=xe&&(!document.documentMode||9<document.documentMode)}function Ae(){pe&&(pe.detachEvent("onpropertychange",Be),qe=pe=null)}function Be(a){if("value"===a.propertyName&&te(qe)){var b=[];ne(b,qe,a,xb(a));a=re;if(Kb)a(b);else{Kb=!0;try{Gb(a,b)}finally{Kb=!1,Mb()}}}}
function Ce(a,b,c){"focusin"===a?(Ae(),pe=b,qe=c,pe.attachEvent("onpropertychange",Be)):"focusout"===a&&Ae()}function De(a){if("selectionchange"===a||"keyup"===a||"keydown"===a)return te(qe)}function Ee(a,b){if("click"===a)return te(b)}function Fe(a,b){if("input"===a||"change"===a)return te(b)}function Ge(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b}var He="function"===typeof Object.is?Object.is:Ge,Ie=Object.prototype.hasOwnProperty;
function Je(a,b){if(He(a,b))return!0;if("object"!==typeof a||null===a||"object"!==typeof b||null===b)return!1;var c=Object.keys(a),d=Object.keys(b);if(c.length!==d.length)return!1;for(d=0;d<c.length;d++)if(!Ie.call(b,c[d])||!He(a[c[d]],b[c[d]]))return!1;return!0}function Ke(a){for(;a&&a.firstChild;)a=a.firstChild;return a}
function Le(a,b){var c=Ke(a);a=0;for(var d;c;){if(3===c.nodeType){d=a+c.textContent.length;if(a<=b&&d>=b)return{node:c,offset:b-a};a=d}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode}c=void 0}c=Ke(c)}}function Me(a,b){return a&&b?a===b?!0:a&&3===a.nodeType?!1:b&&3===b.nodeType?Me(a,b.parentNode):"contains"in a?a.contains(b):a.compareDocumentPosition?!!(a.compareDocumentPosition(b)&16):!1:!1}
function Ne(){for(var a=window,b=Xa();b instanceof a.HTMLIFrameElement;){try{var c="string"===typeof b.contentWindow.location.href}catch(d){c=!1}if(c)a=b.contentWindow;else break;b=Xa(a.document)}return b}function Oe(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&("text"===a.type||"search"===a.type||"tel"===a.type||"url"===a.type||"password"===a.type)||"textarea"===b||"true"===a.contentEditable)}
var Pe=fa&&"documentMode"in document&&11>=document.documentMode,Qe=null,Re=null,Se=null,Te=!1;
function Ue(a,b,c){var d=c.window===c?c.document:9===c.nodeType?c:c.ownerDocument;Te||null==Qe||Qe!==Xa(d)||(d=Qe,"selectionStart"in d&&Oe(d)?d={start:d.selectionStart,end:d.selectionEnd}:(d=(d.ownerDocument&&d.ownerDocument.defaultView||window).getSelection(),d={anchorNode:d.anchorNode,anchorOffset:d.anchorOffset,focusNode:d.focusNode,focusOffset:d.focusOffset}),Se&&Je(Se,d)||(Se=d,d=oe(Re,"onSelect"),0<d.length&&(b=new td("onSelect","select",null,b,c),a.push({event:b,listeners:d}),b.target=Qe)))}
Pc("cancel cancel click click close close contextmenu contextMenu copy copy cut cut auxclick auxClick dblclick doubleClick dragend dragEnd dragstart dragStart drop drop focusin focus focusout blur input input invalid invalid keydown keyDown keypress keyPress keyup keyUp mousedown mouseDown mouseup mouseUp paste paste pause pause play play pointercancel pointerCancel pointerdown pointerDown pointerup pointerUp ratechange rateChange reset reset seeked seeked submit submit touchcancel touchCancel touchend touchEnd touchstart touchStart volumechange volumeChange".split(" "),
0);Pc("drag drag dragenter dragEnter dragexit dragExit dragleave dragLeave dragover dragOver mousemove mouseMove mouseout mouseOut mouseover mouseOver pointermove pointerMove pointerout pointerOut pointerover pointerOver scroll scroll toggle toggle touchmove touchMove wheel wheel".split(" "),1);Pc(Oc,2);for(var Ve="change selectionchange textInput compositionstart compositionend compositionupdate".split(" "),We=0;We<Ve.length;We++)Nc.set(Ve[We],0);ea("onMouseEnter",["mouseout","mouseover"]);
ea("onMouseLeave",["mouseout","mouseover"]);ea("onPointerEnter",["pointerout","pointerover"]);ea("onPointerLeave",["pointerout","pointerover"]);da("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));da("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));da("onBeforeInput",["compositionend","keypress","textInput","paste"]);da("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));
da("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));da("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Xe="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Ye=new Set("cancel close invalid load scroll toggle".split(" ").concat(Xe));
function Ze(a,b,c){var d=a.type||"unknown-event";a.currentTarget=c;Yb(d,b,void 0,a);a.currentTarget=null}
function se(a,b){b=0!==(b&4);for(var c=0;c<a.length;c++){var d=a[c],e=d.event;d=d.listeners;a:{var f=void 0;if(b)for(var g=d.length-1;0<=g;g--){var h=d[g],k=h.instance,l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;Ze(e,h,l);f=k}else for(g=0;g<d.length;g++){h=d[g];k=h.instance;l=h.currentTarget;h=h.listener;if(k!==f&&e.isPropagationStopped())break a;Ze(e,h,l);f=k}}}if(Ub)throw a=Vb,Ub=!1,Vb=null,a;}
function G(a,b){var c=$e(b),d=a+"__bubble";c.has(d)||(af(b,a,2,!1),c.add(d))}var bf="_reactListening"+Math.random().toString(36).slice(2);function cf(a){a[bf]||(a[bf]=!0,ba.forEach(function(b){Ye.has(b)||df(b,!1,a,null);df(b,!0,a,null)}))}
function df(a,b,c,d){var e=4<arguments.length&&void 0!==arguments[4]?arguments[4]:0,f=c;"selectionchange"===a&&9!==c.nodeType&&(f=c.ownerDocument);if(null!==d&&!b&&Ye.has(a)){if("scroll"!==a)return;e|=2;f=d}var g=$e(f),h=a+"__"+(b?"capture":"bubble");g.has(h)||(b&&(e|=4),af(f,a,e,b),g.add(h))}
function af(a,b,c,d){var e=Nc.get(b);switch(void 0===e?2:e){case 0:e=gd;break;case 1:e=id;break;default:e=hd}c=e.bind(null,b,c,a);e=void 0;!Pb||"touchstart"!==b&&"touchmove"!==b&&"wheel"!==b||(e=!0);d?void 0!==e?a.addEventListener(b,c,{capture:!0,passive:e}):a.addEventListener(b,c,!0):void 0!==e?a.addEventListener(b,c,{passive:e}):a.addEventListener(b,c,!1)}
function jd(a,b,c,d,e){var f=d;if(0===(b&1)&&0===(b&2)&&null!==d)a:for(;;){if(null===d)return;var g=d.tag;if(3===g||4===g){var h=d.stateNode.containerInfo;if(h===e||8===h.nodeType&&h.parentNode===e)break;if(4===g)for(g=d.return;null!==g;){var k=g.tag;if(3===k||4===k)if(k=g.stateNode.containerInfo,k===e||8===k.nodeType&&k.parentNode===e)return;g=g.return}for(;null!==h;){g=wc(h);if(null===g)return;k=g.tag;if(5===k||6===k){d=f=g;continue a}h=h.parentNode}}d=d.return}Nb(function(){var d=f,e=xb(c),g=[];
a:{var h=Mc.get(a);if(void 0!==h){var k=td,x=a;switch(a){case "keypress":if(0===od(c))break a;case "keydown":case "keyup":k=Rd;break;case "focusin":x="focus";k=Fd;break;case "focusout":x="blur";k=Fd;break;case "beforeblur":case "afterblur":k=Fd;break;case "click":if(2===c.button)break a;case "auxclick":case "dblclick":case "mousedown":case "mousemove":case "mouseup":case "mouseout":case "mouseover":case "contextmenu":k=Bd;break;case "drag":case "dragend":case "dragenter":case "dragexit":case "dragleave":case "dragover":case "dragstart":case "drop":k=
Dd;break;case "touchcancel":case "touchend":case "touchmove":case "touchstart":k=Vd;break;case Ic:case Jc:case Kc:k=Hd;break;case Lc:k=Xd;break;case "scroll":k=vd;break;case "wheel":k=Zd;break;case "copy":case "cut":case "paste":k=Jd;break;case "gotpointercapture":case "lostpointercapture":case "pointercancel":case "pointerdown":case "pointermove":case "pointerout":case "pointerover":case "pointerup":k=Td}var w=0!==(b&4),z=!w&&"scroll"===a,u=w?null!==h?h+"Capture":null:h;w=[];for(var t=d,q;null!==
t;){q=t;var v=q.stateNode;5===q.tag&&null!==v&&(q=v,null!==u&&(v=Ob(t,u),null!=v&&w.push(ef(t,v,q))));if(z)break;t=t.return}0<w.length&&(h=new k(h,x,null,c,e),g.push({event:h,listeners:w}))}}if(0===(b&7)){a:{h="mouseover"===a||"pointerover"===a;k="mouseout"===a||"pointerout"===a;if(h&&0===(b&16)&&(x=c.relatedTarget||c.fromElement)&&(wc(x)||x[ff]))break a;if(k||h){h=e.window===e?e:(h=e.ownerDocument)?h.defaultView||h.parentWindow:window;if(k){if(x=c.relatedTarget||c.toElement,k=d,x=x?wc(x):null,null!==
x&&(z=Zb(x),x!==z||5!==x.tag&&6!==x.tag))x=null}else k=null,x=d;if(k!==x){w=Bd;v="onMouseLeave";u="onMouseEnter";t="mouse";if("pointerout"===a||"pointerover"===a)w=Td,v="onPointerLeave",u="onPointerEnter",t="pointer";z=null==k?h:ue(k);q=null==x?h:ue(x);h=new w(v,t+"leave",k,c,e);h.target=z;h.relatedTarget=q;v=null;wc(e)===d&&(w=new w(u,t+"enter",x,c,e),w.target=q,w.relatedTarget=z,v=w);z=v;if(k&&x)b:{w=k;u=x;t=0;for(q=w;q;q=gf(q))t++;q=0;for(v=u;v;v=gf(v))q++;for(;0<t-q;)w=gf(w),t--;for(;0<q-t;)u=
gf(u),q--;for(;t--;){if(w===u||null!==u&&w===u.alternate)break b;w=gf(w);u=gf(u)}w=null}else w=null;null!==k&&hf(g,h,k,w,!1);null!==x&&null!==z&&hf(g,z,x,w,!0)}}}a:{h=d?ue(d):window;k=h.nodeName&&h.nodeName.toLowerCase();if("select"===k||"input"===k&&"file"===h.type)var J=ve;else if(me(h))if(we)J=Fe;else{J=De;var K=Ce}else(k=h.nodeName)&&"input"===k.toLowerCase()&&("checkbox"===h.type||"radio"===h.type)&&(J=Ee);if(J&&(J=J(a,d))){ne(g,J,c,e);break a}K&&K(a,h,d);"focusout"===a&&(K=h._wrapperState)&&
K.controlled&&"number"===h.type&&bb(h,"number",h.value)}K=d?ue(d):window;switch(a){case "focusin":if(me(K)||"true"===K.contentEditable)Qe=K,Re=d,Se=null;break;case "focusout":Se=Re=Qe=null;break;case "mousedown":Te=!0;break;case "contextmenu":case "mouseup":case "dragend":Te=!1;Ue(g,c,e);break;case "selectionchange":if(Pe)break;case "keydown":case "keyup":Ue(g,c,e)}var Q;if(ae)b:{switch(a){case "compositionstart":var L="onCompositionStart";break b;case "compositionend":L="onCompositionEnd";break b;
case "compositionupdate":L="onCompositionUpdate";break b}L=void 0}else ie?ge(a,c)&&(L="onCompositionEnd"):"keydown"===a&&229===c.keyCode&&(L="onCompositionStart");L&&(de&&"ko"!==c.locale&&(ie||"onCompositionStart"!==L?"onCompositionEnd"===L&&ie&&(Q=nd()):(kd=e,ld="value"in kd?kd.value:kd.textContent,ie=!0)),K=oe(d,L),0<K.length&&(L=new Ld(L,a,null,c,e),g.push({event:L,listeners:K}),Q?L.data=Q:(Q=he(c),null!==Q&&(L.data=Q))));if(Q=ce?je(a,c):ke(a,c))d=oe(d,"onBeforeInput"),0<d.length&&(e=new Ld("onBeforeInput",
"beforeinput",null,c,e),g.push({event:e,listeners:d}),e.data=Q)}se(g,b)})}function ef(a,b,c){return{instance:a,listener:b,currentTarget:c}}function oe(a,b){for(var c=b+"Capture",d=[];null!==a;){var e=a,f=e.stateNode;5===e.tag&&null!==f&&(e=f,f=Ob(a,c),null!=f&&d.unshift(ef(a,f,e)),f=Ob(a,b),null!=f&&d.push(ef(a,f,e)));a=a.return}return d}function gf(a){if(null===a)return null;do a=a.return;while(a&&5!==a.tag);return a?a:null}
function hf(a,b,c,d,e){for(var f=b._reactName,g=[];null!==c&&c!==d;){var h=c,k=h.alternate,l=h.stateNode;if(null!==k&&k===d)break;5===h.tag&&null!==l&&(h=l,e?(k=Ob(c,f),null!=k&&g.unshift(ef(c,k,h))):e||(k=Ob(c,f),null!=k&&g.push(ef(c,k,h))));c=c.return}0!==g.length&&a.push({event:b,listeners:g})}function jf(){}var kf=null,lf=null;function mf(a,b){switch(a){case "button":case "input":case "select":case "textarea":return!!b.autoFocus}return!1}
function nf(a,b){return"textarea"===a||"option"===a||"noscript"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&null!=b.dangerouslySetInnerHTML.__html}var of="function"===typeof setTimeout?setTimeout:void 0,pf="function"===typeof clearTimeout?clearTimeout:void 0;function qf(a){1===a.nodeType?a.textContent="":9===a.nodeType&&(a=a.body,null!=a&&(a.textContent=""))}
function rf(a){for(;null!=a;a=a.nextSibling){var b=a.nodeType;if(1===b||3===b)break}return a}function sf(a){a=a.previousSibling;for(var b=0;a;){if(8===a.nodeType){var c=a.data;if("$"===c||"$!"===c||"$?"===c){if(0===b)return a;b--}else"/$"===c&&b++}a=a.previousSibling}return null}var tf=0;function uf(a){return{$$typeof:Ga,toString:a,valueOf:a}}var vf=Math.random().toString(36).slice(2),wf="__reactFiber$"+vf,xf="__reactProps$"+vf,ff="__reactContainer$"+vf,yf="__reactEvents$"+vf;
function wc(a){var b=a[wf];if(b)return b;for(var c=a.parentNode;c;){if(b=c[ff]||c[wf]){c=b.alternate;if(null!==b.child||null!==c&&null!==c.child)for(a=sf(a);null!==a;){if(c=a[wf])return c;a=sf(a)}return b}a=c;c=a.parentNode}return null}function Cb(a){a=a[wf]||a[ff];return!a||5!==a.tag&&6!==a.tag&&13!==a.tag&&3!==a.tag?null:a}function ue(a){if(5===a.tag||6===a.tag)return a.stateNode;throw Error(y(33));}function Db(a){return a[xf]||null}
function $e(a){var b=a[yf];void 0===b&&(b=a[yf]=new Set);return b}var zf=[],Af=-1;function Bf(a){return{current:a}}function H(a){0>Af||(a.current=zf[Af],zf[Af]=null,Af--)}function I(a,b){Af++;zf[Af]=a.current;a.current=b}var Cf={},M=Bf(Cf),N=Bf(!1),Df=Cf;
function Ef(a,b){var c=a.type.contextTypes;if(!c)return Cf;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=b,a.__reactInternalMemoizedMaskedChildContext=e);return e}function Ff(a){a=a.childContextTypes;return null!==a&&void 0!==a}function Gf(){H(N);H(M)}function Hf(a,b,c){if(M.current!==Cf)throw Error(y(168));I(M,b);I(N,c)}
function If(a,b,c){var d=a.stateNode;a=b.childContextTypes;if("function"!==typeof d.getChildContext)return c;d=d.getChildContext();for(var e in d)if(!(e in a))throw Error(y(108,Ra(b)||"Unknown",e));return m({},c,d)}function Jf(a){a=(a=a.stateNode)&&a.__reactInternalMemoizedMergedChildContext||Cf;Df=M.current;I(M,a);I(N,N.current);return!0}function Kf(a,b,c){var d=a.stateNode;if(!d)throw Error(y(169));c?(a=If(a,b,Df),d.__reactInternalMemoizedMergedChildContext=a,H(N),H(M),I(M,a)):H(N);I(N,c)}
var Lf=null,Mf=null,Nf=r.unstable_runWithPriority,Of=r.unstable_scheduleCallback,Pf=r.unstable_cancelCallback,Qf=r.unstable_shouldYield,Rf=r.unstable_requestPaint,Sf=r.unstable_now,Tf=r.unstable_getCurrentPriorityLevel,Uf=r.unstable_ImmediatePriority,Vf=r.unstable_UserBlockingPriority,Wf=r.unstable_NormalPriority,Xf=r.unstable_LowPriority,Yf=r.unstable_IdlePriority,Zf={},$f=void 0!==Rf?Rf:function(){},ag=null,bg=null,cg=!1,dg=Sf(),O=1E4>dg?Sf:function(){return Sf()-dg};
function eg(){switch(Tf()){case Uf:return 99;case Vf:return 98;case Wf:return 97;case Xf:return 96;case Yf:return 95;default:throw Error(y(332));}}function fg(a){switch(a){case 99:return Uf;case 98:return Vf;case 97:return Wf;case 96:return Xf;case 95:return Yf;default:throw Error(y(332));}}function gg(a,b){a=fg(a);return Nf(a,b)}function hg(a,b,c){a=fg(a);return Of(a,b,c)}function ig(){if(null!==bg){var a=bg;bg=null;Pf(a)}jg()}
function jg(){if(!cg&&null!==ag){cg=!0;var a=0;try{var b=ag;gg(99,function(){for(;a<b.length;a++){var c=b[a];do c=c(!0);while(null!==c)}});ag=null}catch(c){throw null!==ag&&(ag=ag.slice(a+1)),Of(Uf,ig),c;}finally{cg=!1}}}var kg=ra.ReactCurrentBatchConfig;function lg(a,b){if(a&&a.defaultProps){b=m({},b);a=a.defaultProps;for(var c in a)void 0===b[c]&&(b[c]=a[c]);return b}return b}var mg=Bf(null),ng=null,og=null,pg=null;function qg(){pg=og=ng=null}
function rg(a){var b=mg.current;H(mg);a.type._context._currentValue=b}function sg(a,b){for(;null!==a;){var c=a.alternate;if((a.childLanes&b)===b)if(null===c||(c.childLanes&b)===b)break;else c.childLanes|=b;else a.childLanes|=b,null!==c&&(c.childLanes|=b);a=a.return}}function tg(a,b){ng=a;pg=og=null;a=a.dependencies;null!==a&&null!==a.firstContext&&(0!==(a.lanes&b)&&(ug=!0),a.firstContext=null)}
function vg(a,b){if(pg!==a&&!1!==b&&0!==b){if("number"!==typeof b||1073741823===b)pg=a,b=1073741823;b={context:a,observedBits:b,next:null};if(null===og){if(null===ng)throw Error(y(308));og=b;ng.dependencies={lanes:0,firstContext:b,responders:null}}else og=og.next=b}return a._currentValue}var wg=!1;function xg(a){a.updateQueue={baseState:a.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null},effects:null}}
function yg(a,b){a=a.updateQueue;b.updateQueue===a&&(b.updateQueue={baseState:a.baseState,firstBaseUpdate:a.firstBaseUpdate,lastBaseUpdate:a.lastBaseUpdate,shared:a.shared,effects:a.effects})}function zg(a,b){return{eventTime:a,lane:b,tag:0,payload:null,callback:null,next:null}}function Ag(a,b){a=a.updateQueue;if(null!==a){a=a.shared;var c=a.pending;null===c?b.next=b:(b.next=c.next,c.next=b);a.pending=b}}
function Bg(a,b){var c=a.updateQueue,d=a.alternate;if(null!==d&&(d=d.updateQueue,c===d)){var e=null,f=null;c=c.firstBaseUpdate;if(null!==c){do{var g={eventTime:c.eventTime,lane:c.lane,tag:c.tag,payload:c.payload,callback:c.callback,next:null};null===f?e=f=g:f=f.next=g;c=c.next}while(null!==c);null===f?e=f=b:f=f.next=b}else e=f=b;c={baseState:d.baseState,firstBaseUpdate:e,lastBaseUpdate:f,shared:d.shared,effects:d.effects};a.updateQueue=c;return}a=c.lastBaseUpdate;null===a?c.firstBaseUpdate=b:a.next=
b;c.lastBaseUpdate=b}
function Cg(a,b,c,d){var e=a.updateQueue;wg=!1;var f=e.firstBaseUpdate,g=e.lastBaseUpdate,h=e.shared.pending;if(null!==h){e.shared.pending=null;var k=h,l=k.next;k.next=null;null===g?f=l:g.next=l;g=k;var n=a.alternate;if(null!==n){n=n.updateQueue;var A=n.lastBaseUpdate;A!==g&&(null===A?n.firstBaseUpdate=l:A.next=l,n.lastBaseUpdate=k)}}if(null!==f){A=e.baseState;g=0;n=l=k=null;do{h=f.lane;var p=f.eventTime;if((d&h)===h){null!==n&&(n=n.next={eventTime:p,lane:0,tag:f.tag,payload:f.payload,callback:f.callback,
next:null});a:{var C=a,x=f;h=b;p=c;switch(x.tag){case 1:C=x.payload;if("function"===typeof C){A=C.call(p,A,h);break a}A=C;break a;case 3:C.flags=C.flags&-4097|64;case 0:C=x.payload;h="function"===typeof C?C.call(p,A,h):C;if(null===h||void 0===h)break a;A=m({},A,h);break a;case 2:wg=!0}}null!==f.callback&&(a.flags|=32,h=e.effects,null===h?e.effects=[f]:h.push(f))}else p={eventTime:p,lane:h,tag:f.tag,payload:f.payload,callback:f.callback,next:null},null===n?(l=n=p,k=A):n=n.next=p,g|=h;f=f.next;if(null===
f)if(h=e.shared.pending,null===h)break;else f=h.next,h.next=null,e.lastBaseUpdate=h,e.shared.pending=null}while(1);null===n&&(k=A);e.baseState=k;e.firstBaseUpdate=l;e.lastBaseUpdate=n;Dg|=g;a.lanes=g;a.memoizedState=A}}function Eg(a,b,c){a=b.effects;b.effects=null;if(null!==a)for(b=0;b<a.length;b++){var d=a[b],e=d.callback;if(null!==e){d.callback=null;d=c;if("function"!==typeof e)throw Error(y(191,e));e.call(d)}}}var Fg=(new aa.Component).refs;
function Gg(a,b,c,d){b=a.memoizedState;c=c(d,b);c=null===c||void 0===c?b:m({},b,c);a.memoizedState=c;0===a.lanes&&(a.updateQueue.baseState=c)}
var Kg={isMounted:function(a){return(a=a._reactInternals)?Zb(a)===a:!1},enqueueSetState:function(a,b,c){a=a._reactInternals;var d=Hg(),e=Ig(a),f=zg(d,e);f.payload=b;void 0!==c&&null!==c&&(f.callback=c);Ag(a,f);Jg(a,e,d)},enqueueReplaceState:function(a,b,c){a=a._reactInternals;var d=Hg(),e=Ig(a),f=zg(d,e);f.tag=1;f.payload=b;void 0!==c&&null!==c&&(f.callback=c);Ag(a,f);Jg(a,e,d)},enqueueForceUpdate:function(a,b){a=a._reactInternals;var c=Hg(),d=Ig(a),e=zg(c,d);e.tag=2;void 0!==b&&null!==b&&(e.callback=
b);Ag(a,e);Jg(a,d,c)}};function Lg(a,b,c,d,e,f,g){a=a.stateNode;return"function"===typeof a.shouldComponentUpdate?a.shouldComponentUpdate(d,f,g):b.prototype&&b.prototype.isPureReactComponent?!Je(c,d)||!Je(e,f):!0}
function Mg(a,b,c){var d=!1,e=Cf;var f=b.contextType;"object"===typeof f&&null!==f?f=vg(f):(e=Ff(b)?Df:M.current,d=b.contextTypes,f=(d=null!==d&&void 0!==d)?Ef(a,e):Cf);b=new b(c,f);a.memoizedState=null!==b.state&&void 0!==b.state?b.state:null;b.updater=Kg;a.stateNode=b;b._reactInternals=a;d&&(a=a.stateNode,a.__reactInternalMemoizedUnmaskedChildContext=e,a.__reactInternalMemoizedMaskedChildContext=f);return b}
function Ng(a,b,c,d){a=b.state;"function"===typeof b.componentWillReceiveProps&&b.componentWillReceiveProps(c,d);"function"===typeof b.UNSAFE_componentWillReceiveProps&&b.UNSAFE_componentWillReceiveProps(c,d);b.state!==a&&Kg.enqueueReplaceState(b,b.state,null)}
function Og(a,b,c,d){var e=a.stateNode;e.props=c;e.state=a.memoizedState;e.refs=Fg;xg(a);var f=b.contextType;"object"===typeof f&&null!==f?e.context=vg(f):(f=Ff(b)?Df:M.current,e.context=Ef(a,f));Cg(a,c,e,d);e.state=a.memoizedState;f=b.getDerivedStateFromProps;"function"===typeof f&&(Gg(a,b,f,c),e.state=a.memoizedState);"function"===typeof b.getDerivedStateFromProps||"function"===typeof e.getSnapshotBeforeUpdate||"function"!==typeof e.UNSAFE_componentWillMount&&"function"!==typeof e.componentWillMount||
(b=e.state,"function"===typeof e.componentWillMount&&e.componentWillMount(),"function"===typeof e.UNSAFE_componentWillMount&&e.UNSAFE_componentWillMount(),b!==e.state&&Kg.enqueueReplaceState(e,e.state,null),Cg(a,c,e,d),e.state=a.memoizedState);"function"===typeof e.componentDidMount&&(a.flags|=4)}var Pg=Array.isArray;
function Qg(a,b,c){a=c.ref;if(null!==a&&"function"!==typeof a&&"object"!==typeof a){if(c._owner){c=c._owner;if(c){if(1!==c.tag)throw Error(y(309));var d=c.stateNode}if(!d)throw Error(y(147,a));var e=""+a;if(null!==b&&null!==b.ref&&"function"===typeof b.ref&&b.ref._stringRef===e)return b.ref;b=function(a){var b=d.refs;b===Fg&&(b=d.refs={});null===a?delete b[e]:b[e]=a};b._stringRef=e;return b}if("string"!==typeof a)throw Error(y(284));if(!c._owner)throw Error(y(290,a));}return a}
function Rg(a,b){if("textarea"!==a.type)throw Error(y(31,"[object Object]"===Object.prototype.toString.call(b)?"object with keys {"+Object.keys(b).join(", ")+"}":b));}
function Sg(a){function b(b,c){if(a){var d=b.lastEffect;null!==d?(d.nextEffect=c,b.lastEffect=c):b.firstEffect=b.lastEffect=c;c.nextEffect=null;c.flags=8}}function c(c,d){if(!a)return null;for(;null!==d;)b(c,d),d=d.sibling;return null}function d(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function e(a,b){a=Tg(a,b);a.index=0;a.sibling=null;return a}function f(b,c,d){b.index=d;if(!a)return c;d=b.alternate;if(null!==d)return d=d.index,d<c?(b.flags=2,
c):d;b.flags=2;return c}function g(b){a&&null===b.alternate&&(b.flags=2);return b}function h(a,b,c,d){if(null===b||6!==b.tag)return b=Ug(c,a.mode,d),b.return=a,b;b=e(b,c);b.return=a;return b}function k(a,b,c,d){if(null!==b&&b.elementType===c.type)return d=e(b,c.props),d.ref=Qg(a,b,c),d.return=a,d;d=Vg(c.type,c.key,c.props,null,a.mode,d);d.ref=Qg(a,b,c);d.return=a;return d}function l(a,b,c,d){if(null===b||4!==b.tag||b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return b=
Wg(c,a.mode,d),b.return=a,b;b=e(b,c.children||[]);b.return=a;return b}function n(a,b,c,d,f){if(null===b||7!==b.tag)return b=Xg(c,a.mode,d,f),b.return=a,b;b=e(b,c);b.return=a;return b}function A(a,b,c){if("string"===typeof b||"number"===typeof b)return b=Ug(""+b,a.mode,c),b.return=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case sa:return c=Vg(b.type,b.key,b.props,null,a.mode,c),c.ref=Qg(a,null,b),c.return=a,c;case ta:return b=Wg(b,a.mode,c),b.return=a,b}if(Pg(b)||La(b))return b=Xg(b,
a.mode,c,null),b.return=a,b;Rg(a,b)}return null}function p(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c||"number"===typeof c)return null!==e?null:h(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case sa:return c.key===e?c.type===ua?n(a,b,c.props.children,d,e):k(a,b,c,d):null;case ta:return c.key===e?l(a,b,c,d):null}if(Pg(c)||La(c))return null!==e?null:n(a,b,c,d,null);Rg(a,c)}return null}function C(a,b,c,d,e){if("string"===typeof d||"number"===typeof d)return a=a.get(c)||
null,h(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case sa:return a=a.get(null===d.key?c:d.key)||null,d.type===ua?n(b,a,d.props.children,e,d.key):k(b,a,d,e);case ta:return a=a.get(null===d.key?c:d.key)||null,l(b,a,d,e)}if(Pg(d)||La(d))return a=a.get(c)||null,n(b,a,d,e,null);Rg(b,d)}return null}function x(e,g,h,k){for(var l=null,t=null,u=g,z=g=0,q=null;null!==u&&z<h.length;z++){u.index>z?(q=u,u=null):q=u.sibling;var n=p(e,u,h[z],k);if(null===n){null===u&&(u=q);break}a&&u&&null===
n.alternate&&b(e,u);g=f(n,g,z);null===t?l=n:t.sibling=n;t=n;u=q}if(z===h.length)return c(e,u),l;if(null===u){for(;z<h.length;z++)u=A(e,h[z],k),null!==u&&(g=f(u,g,z),null===t?l=u:t.sibling=u,t=u);return l}for(u=d(e,u);z<h.length;z++)q=C(u,e,z,h[z],k),null!==q&&(a&&null!==q.alternate&&u.delete(null===q.key?z:q.key),g=f(q,g,z),null===t?l=q:t.sibling=q,t=q);a&&u.forEach(function(a){return b(e,a)});return l}function w(e,g,h,k){var l=La(h);if("function"!==typeof l)throw Error(y(150));h=l.call(h);if(null==
h)throw Error(y(151));for(var t=l=null,u=g,z=g=0,q=null,n=h.next();null!==u&&!n.done;z++,n=h.next()){u.index>z?(q=u,u=null):q=u.sibling;var w=p(e,u,n.value,k);if(null===w){null===u&&(u=q);break}a&&u&&null===w.alternate&&b(e,u);g=f(w,g,z);null===t?l=w:t.sibling=w;t=w;u=q}if(n.done)return c(e,u),l;if(null===u){for(;!n.done;z++,n=h.next())n=A(e,n.value,k),null!==n&&(g=f(n,g,z),null===t?l=n:t.sibling=n,t=n);return l}for(u=d(e,u);!n.done;z++,n=h.next())n=C(u,e,z,n.value,k),null!==n&&(a&&null!==n.alternate&&
u.delete(null===n.key?z:n.key),g=f(n,g,z),null===t?l=n:t.sibling=n,t=n);a&&u.forEach(function(a){return b(e,a)});return l}return function(a,d,f,h){var k="object"===typeof f&&null!==f&&f.type===ua&&null===f.key;k&&(f=f.props.children);var l="object"===typeof f&&null!==f;if(l)switch(f.$$typeof){case sa:a:{l=f.key;for(k=d;null!==k;){if(k.key===l){switch(k.tag){case 7:if(f.type===ua){c(a,k.sibling);d=e(k,f.props.children);d.return=a;a=d;break a}break;default:if(k.elementType===f.type){c(a,k.sibling);
d=e(k,f.props);d.ref=Qg(a,k,f);d.return=a;a=d;break a}}c(a,k);break}else b(a,k);k=k.sibling}f.type===ua?(d=Xg(f.props.children,a.mode,h,f.key),d.return=a,a=d):(h=Vg(f.type,f.key,f.props,null,a.mode,h),h.ref=Qg(a,d,f),h.return=a,a=h)}return g(a);case ta:a:{for(k=f.key;null!==d;){if(d.key===k)if(4===d.tag&&d.stateNode.containerInfo===f.containerInfo&&d.stateNode.implementation===f.implementation){c(a,d.sibling);d=e(d,f.children||[]);d.return=a;a=d;break a}else{c(a,d);break}else b(a,d);d=d.sibling}d=
Wg(f,a.mode,h);d.return=a;a=d}return g(a)}if("string"===typeof f||"number"===typeof f)return f=""+f,null!==d&&6===d.tag?(c(a,d.sibling),d=e(d,f),d.return=a,a=d):(c(a,d),d=Ug(f,a.mode,h),d.return=a,a=d),g(a);if(Pg(f))return x(a,d,f,h);if(La(f))return w(a,d,f,h);l&&Rg(a,f);if("undefined"===typeof f&&!k)switch(a.tag){case 1:case 22:case 0:case 11:case 15:throw Error(y(152,Ra(a.type)||"Component"));}return c(a,d)}}var Yg=Sg(!0),Zg=Sg(!1),$g={},ah=Bf($g),bh=Bf($g),ch=Bf($g);
function dh(a){if(a===$g)throw Error(y(174));return a}function eh(a,b){I(ch,b);I(bh,a);I(ah,$g);a=b.nodeType;switch(a){case 9:case 11:b=(b=b.documentElement)?b.namespaceURI:mb(null,"");break;default:a=8===a?b.parentNode:b,b=a.namespaceURI||null,a=a.tagName,b=mb(b,a)}H(ah);I(ah,b)}function fh(){H(ah);H(bh);H(ch)}function gh(a){dh(ch.current);var b=dh(ah.current);var c=mb(b,a.type);b!==c&&(I(bh,a),I(ah,c))}function hh(a){bh.current===a&&(H(ah),H(bh))}var P=Bf(0);
function ih(a){for(var b=a;null!==b;){if(13===b.tag){var c=b.memoizedState;if(null!==c&&(c=c.dehydrated,null===c||"$?"===c.data||"$!"===c.data))return b}else if(19===b.tag&&void 0!==b.memoizedProps.revealOrder){if(0!==(b.flags&64))return b}else if(null!==b.child){b.child.return=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b.return||b.return===a)return null;b=b.return}b.sibling.return=b.return;b=b.sibling}return null}var jh=null,kh=null,lh=!1;
function mh(a,b){var c=nh(5,null,null,0);c.elementType="DELETED";c.type="DELETED";c.stateNode=b;c.return=a;c.flags=8;null!==a.lastEffect?(a.lastEffect.nextEffect=c,a.lastEffect=c):a.firstEffect=a.lastEffect=c}function oh(a,b){switch(a.tag){case 5:var c=a.type;b=1!==b.nodeType||c.toLowerCase()!==b.nodeName.toLowerCase()?null:b;return null!==b?(a.stateNode=b,!0):!1;case 6:return b=""===a.pendingProps||3!==b.nodeType?null:b,null!==b?(a.stateNode=b,!0):!1;case 13:return!1;default:return!1}}
function ph(a){if(lh){var b=kh;if(b){var c=b;if(!oh(a,b)){b=rf(c.nextSibling);if(!b||!oh(a,b)){a.flags=a.flags&-1025|2;lh=!1;jh=a;return}mh(jh,c)}jh=a;kh=rf(b.firstChild)}else a.flags=a.flags&-1025|2,lh=!1,jh=a}}function qh(a){for(a=a.return;null!==a&&5!==a.tag&&3!==a.tag&&13!==a.tag;)a=a.return;jh=a}
function rh(a){if(a!==jh)return!1;if(!lh)return qh(a),lh=!0,!1;var b=a.type;if(5!==a.tag||"head"!==b&&"body"!==b&&!nf(b,a.memoizedProps))for(b=kh;b;)mh(a,b),b=rf(b.nextSibling);qh(a);if(13===a.tag){a=a.memoizedState;a=null!==a?a.dehydrated:null;if(!a)throw Error(y(317));a:{a=a.nextSibling;for(b=0;a;){if(8===a.nodeType){var c=a.data;if("/$"===c){if(0===b){kh=rf(a.nextSibling);break a}b--}else"$"!==c&&"$!"!==c&&"$?"!==c||b++}a=a.nextSibling}kh=null}}else kh=jh?rf(a.stateNode.nextSibling):null;return!0}
function sh(){kh=jh=null;lh=!1}var th=[];function uh(){for(var a=0;a<th.length;a++)th[a]._workInProgressVersionPrimary=null;th.length=0}var vh=ra.ReactCurrentDispatcher,wh=ra.ReactCurrentBatchConfig,xh=0,R=null,S=null,T=null,yh=!1,zh=!1;function Ah(){throw Error(y(321));}function Bh(a,b){if(null===b)return!1;for(var c=0;c<b.length&&c<a.length;c++)if(!He(a[c],b[c]))return!1;return!0}
function Ch(a,b,c,d,e,f){xh=f;R=b;b.memoizedState=null;b.updateQueue=null;b.lanes=0;vh.current=null===a||null===a.memoizedState?Dh:Eh;a=c(d,e);if(zh){f=0;do{zh=!1;if(!(25>f))throw Error(y(301));f+=1;T=S=null;b.updateQueue=null;vh.current=Fh;a=c(d,e)}while(zh)}vh.current=Gh;b=null!==S&&null!==S.next;xh=0;T=S=R=null;yh=!1;if(b)throw Error(y(300));return a}function Hh(){var a={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};null===T?R.memoizedState=T=a:T=T.next=a;return T}
function Ih(){if(null===S){var a=R.alternate;a=null!==a?a.memoizedState:null}else a=S.next;var b=null===T?R.memoizedState:T.next;if(null!==b)T=b,S=a;else{if(null===a)throw Error(y(310));S=a;a={memoizedState:S.memoizedState,baseState:S.baseState,baseQueue:S.baseQueue,queue:S.queue,next:null};null===T?R.memoizedState=T=a:T=T.next=a}return T}function Jh(a,b){return"function"===typeof b?b(a):b}
function Kh(a){var b=Ih(),c=b.queue;if(null===c)throw Error(y(311));c.lastRenderedReducer=a;var d=S,e=d.baseQueue,f=c.pending;if(null!==f){if(null!==e){var g=e.next;e.next=f.next;f.next=g}d.baseQueue=e=f;c.pending=null}if(null!==e){e=e.next;d=d.baseState;var h=g=f=null,k=e;do{var l=k.lane;if((xh&l)===l)null!==h&&(h=h.next={lane:0,action:k.action,eagerReducer:k.eagerReducer,eagerState:k.eagerState,next:null}),d=k.eagerReducer===a?k.eagerState:a(d,k.action);else{var n={lane:l,action:k.action,eagerReducer:k.eagerReducer,
eagerState:k.eagerState,next:null};null===h?(g=h=n,f=d):h=h.next=n;R.lanes|=l;Dg|=l}k=k.next}while(null!==k&&k!==e);null===h?f=d:h.next=g;He(d,b.memoizedState)||(ug=!0);b.memoizedState=d;b.baseState=f;b.baseQueue=h;c.lastRenderedState=d}return[b.memoizedState,c.dispatch]}
function Lh(a){var b=Ih(),c=b.queue;if(null===c)throw Error(y(311));c.lastRenderedReducer=a;var d=c.dispatch,e=c.pending,f=b.memoizedState;if(null!==e){c.pending=null;var g=e=e.next;do f=a(f,g.action),g=g.next;while(g!==e);He(f,b.memoizedState)||(ug=!0);b.memoizedState=f;null===b.baseQueue&&(b.baseState=f);c.lastRenderedState=f}return[f,d]}
function Mh(a,b,c){var d=b._getVersion;d=d(b._source);var e=b._workInProgressVersionPrimary;if(null!==e)a=e===d;else if(a=a.mutableReadLanes,a=(xh&a)===a)b._workInProgressVersionPrimary=d,th.push(b);if(a)return c(b._source);th.push(b);throw Error(y(350));}
function Nh(a,b,c,d){var e=U;if(null===e)throw Error(y(349));var f=b._getVersion,g=f(b._source),h=vh.current,k=h.useState(function(){return Mh(e,b,c)}),l=k[1],n=k[0];k=T;var A=a.memoizedState,p=A.refs,C=p.getSnapshot,x=A.source;A=A.subscribe;var w=R;a.memoizedState={refs:p,source:b,subscribe:d};h.useEffect(function(){p.getSnapshot=c;p.setSnapshot=l;var a=f(b._source);if(!He(g,a)){a=c(b._source);He(n,a)||(l(a),a=Ig(w),e.mutableReadLanes|=a&e.pendingLanes);a=e.mutableReadLanes;e.entangledLanes|=a;for(var d=
e.entanglements,h=a;0<h;){var k=31-Vc(h),v=1<<k;d[k]|=a;h&=~v}}},[c,b,d]);h.useEffect(function(){return d(b._source,function(){var a=p.getSnapshot,c=p.setSnapshot;try{c(a(b._source));var d=Ig(w);e.mutableReadLanes|=d&e.pendingLanes}catch(q){c(function(){throw q;})}})},[b,d]);He(C,c)&&He(x,b)&&He(A,d)||(a={pending:null,dispatch:null,lastRenderedReducer:Jh,lastRenderedState:n},a.dispatch=l=Oh.bind(null,R,a),k.queue=a,k.baseQueue=null,n=Mh(e,b,c),k.memoizedState=k.baseState=n);return n}
function Ph(a,b,c){var d=Ih();return Nh(d,a,b,c)}function Qh(a){var b=Hh();"function"===typeof a&&(a=a());b.memoizedState=b.baseState=a;a=b.queue={pending:null,dispatch:null,lastRenderedReducer:Jh,lastRenderedState:a};a=a.dispatch=Oh.bind(null,R,a);return[b.memoizedState,a]}
function Rh(a,b,c,d){a={tag:a,create:b,destroy:c,deps:d,next:null};b=R.updateQueue;null===b?(b={lastEffect:null},R.updateQueue=b,b.lastEffect=a.next=a):(c=b.lastEffect,null===c?b.lastEffect=a.next=a:(d=c.next,c.next=a,a.next=d,b.lastEffect=a));return a}function Sh(a){var b=Hh();a={current:a};return b.memoizedState=a}function Th(){return Ih().memoizedState}function Uh(a,b,c,d){var e=Hh();R.flags|=a;e.memoizedState=Rh(1|b,c,void 0,void 0===d?null:d)}
function Vh(a,b,c,d){var e=Ih();d=void 0===d?null:d;var f=void 0;if(null!==S){var g=S.memoizedState;f=g.destroy;if(null!==d&&Bh(d,g.deps)){Rh(b,c,f,d);return}}R.flags|=a;e.memoizedState=Rh(1|b,c,f,d)}function Wh(a,b){return Uh(516,4,a,b)}function Xh(a,b){return Vh(516,4,a,b)}function Yh(a,b){return Vh(4,2,a,b)}function Zh(a,b){if("function"===typeof b)return a=a(),b(a),function(){b(null)};if(null!==b&&void 0!==b)return a=a(),b.current=a,function(){b.current=null}}
function $h(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return Vh(4,2,Zh.bind(null,b,a),c)}function ai(){}function bi(a,b){var c=Ih();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Bh(b,d[1]))return d[0];c.memoizedState=[a,b];return a}function ci(a,b){var c=Ih();b=void 0===b?null:b;var d=c.memoizedState;if(null!==d&&null!==b&&Bh(b,d[1]))return d[0];a=a();c.memoizedState=[a,b];return a}
function di(a,b){var c=eg();gg(98>c?98:c,function(){a(!0)});gg(97<c?97:c,function(){var c=wh.transition;wh.transition=1;try{a(!1),b()}finally{wh.transition=c}})}
function Oh(a,b,c){var d=Hg(),e=Ig(a),f={lane:e,action:c,eagerReducer:null,eagerState:null,next:null},g=b.pending;null===g?f.next=f:(f.next=g.next,g.next=f);b.pending=f;g=a.alternate;if(a===R||null!==g&&g===R)zh=yh=!0;else{if(0===a.lanes&&(null===g||0===g.lanes)&&(g=b.lastRenderedReducer,null!==g))try{var h=b.lastRenderedState,k=g(h,c);f.eagerReducer=g;f.eagerState=k;if(He(k,h))return}catch(l){}finally{}Jg(a,e,d)}}
var Gh={readContext:vg,useCallback:Ah,useContext:Ah,useEffect:Ah,useImperativeHandle:Ah,useLayoutEffect:Ah,useMemo:Ah,useReducer:Ah,useRef:Ah,useState:Ah,useDebugValue:Ah,useDeferredValue:Ah,useTransition:Ah,useMutableSource:Ah,useOpaqueIdentifier:Ah,unstable_isNewReconciler:!1},Dh={readContext:vg,useCallback:function(a,b){Hh().memoizedState=[a,void 0===b?null:b];return a},useContext:vg,useEffect:Wh,useImperativeHandle:function(a,b,c){c=null!==c&&void 0!==c?c.concat([a]):null;return Uh(4,2,Zh.bind(null,
b,a),c)},useLayoutEffect:function(a,b){return Uh(4,2,a,b)},useMemo:function(a,b){var c=Hh();b=void 0===b?null:b;a=a();c.memoizedState=[a,b];return a},useReducer:function(a,b,c){var d=Hh();b=void 0!==c?c(b):b;d.memoizedState=d.baseState=b;a=d.queue={pending:null,dispatch:null,lastRenderedReducer:a,lastRenderedState:b};a=a.dispatch=Oh.bind(null,R,a);return[d.memoizedState,a]},useRef:Sh,useState:Qh,useDebugValue:ai,useDeferredValue:function(a){var b=Qh(a),c=b[0],d=b[1];Wh(function(){var b=wh.transition;
wh.transition=1;try{d(a)}finally{wh.transition=b}},[a]);return c},useTransition:function(){var a=Qh(!1),b=a[0];a=di.bind(null,a[1]);Sh(a);return[a,b]},useMutableSource:function(a,b,c){var d=Hh();d.memoizedState={refs:{getSnapshot:b,setSnapshot:null},source:a,subscribe:c};return Nh(d,a,b,c)},useOpaqueIdentifier:function(){if(lh){var a=!1,b=uf(function(){a||(a=!0,c("r:"+(tf++).toString(36)));throw Error(y(355));}),c=Qh(b)[1];0===(R.mode&2)&&(R.flags|=516,Rh(5,function(){c("r:"+(tf++).toString(36))},
void 0,null));return b}b="r:"+(tf++).toString(36);Qh(b);return b},unstable_isNewReconciler:!1},Eh={readContext:vg,useCallback:bi,useContext:vg,useEffect:Xh,useImperativeHandle:$h,useLayoutEffect:Yh,useMemo:ci,useReducer:Kh,useRef:Th,useState:function(){return Kh(Jh)},useDebugValue:ai,useDeferredValue:function(a){var b=Kh(Jh),c=b[0],d=b[1];Xh(function(){var b=wh.transition;wh.transition=1;try{d(a)}finally{wh.transition=b}},[a]);return c},useTransition:function(){var a=Kh(Jh)[0];return[Th().current,
a]},useMutableSource:Ph,useOpaqueIdentifier:function(){return Kh(Jh)[0]},unstable_isNewReconciler:!1},Fh={readContext:vg,useCallback:bi,useContext:vg,useEffect:Xh,useImperativeHandle:$h,useLayoutEffect:Yh,useMemo:ci,useReducer:Lh,useRef:Th,useState:function(){return Lh(Jh)},useDebugValue:ai,useDeferredValue:function(a){var b=Lh(Jh),c=b[0],d=b[1];Xh(function(){var b=wh.transition;wh.transition=1;try{d(a)}finally{wh.transition=b}},[a]);return c},useTransition:function(){var a=Lh(Jh)[0];return[Th().current,
a]},useMutableSource:Ph,useOpaqueIdentifier:function(){return Lh(Jh)[0]},unstable_isNewReconciler:!1},ei=ra.ReactCurrentOwner,ug=!1;function fi(a,b,c,d){b.child=null===a?Zg(b,null,c,d):Yg(b,a.child,c,d)}function gi(a,b,c,d,e){c=c.render;var f=b.ref;tg(b,e);d=Ch(a,b,c,d,f,e);if(null!==a&&!ug)return b.updateQueue=a.updateQueue,b.flags&=-517,a.lanes&=~e,hi(a,b,e);b.flags|=1;fi(a,b,d,e);return b.child}
function ii(a,b,c,d,e,f){if(null===a){var g=c.type;if("function"===typeof g&&!ji(g)&&void 0===g.defaultProps&&null===c.compare&&void 0===c.defaultProps)return b.tag=15,b.type=g,ki(a,b,g,d,e,f);a=Vg(c.type,null,d,b,b.mode,f);a.ref=b.ref;a.return=b;return b.child=a}g=a.child;if(0===(e&f)&&(e=g.memoizedProps,c=c.compare,c=null!==c?c:Je,c(e,d)&&a.ref===b.ref))return hi(a,b,f);b.flags|=1;a=Tg(g,d);a.ref=b.ref;a.return=b;return b.child=a}
function ki(a,b,c,d,e,f){if(null!==a&&Je(a.memoizedProps,d)&&a.ref===b.ref)if(ug=!1,0!==(f&e))0!==(a.flags&16384)&&(ug=!0);else return b.lanes=a.lanes,hi(a,b,f);return li(a,b,c,d,f)}
function mi(a,b,c){var d=b.pendingProps,e=d.children,f=null!==a?a.memoizedState:null;if("hidden"===d.mode||"unstable-defer-without-hiding"===d.mode)if(0===(b.mode&4))b.memoizedState={baseLanes:0},ni(b,c);else if(0!==(c&1073741824))b.memoizedState={baseLanes:0},ni(b,null!==f?f.baseLanes:c);else return a=null!==f?f.baseLanes|c:c,b.lanes=b.childLanes=1073741824,b.memoizedState={baseLanes:a},ni(b,a),null;else null!==f?(d=f.baseLanes|c,b.memoizedState=null):d=c,ni(b,d);fi(a,b,e,c);return b.child}
function oi(a,b){var c=b.ref;if(null===a&&null!==c||null!==a&&a.ref!==c)b.flags|=128}function li(a,b,c,d,e){var f=Ff(c)?Df:M.current;f=Ef(b,f);tg(b,e);c=Ch(a,b,c,d,f,e);if(null!==a&&!ug)return b.updateQueue=a.updateQueue,b.flags&=-517,a.lanes&=~e,hi(a,b,e);b.flags|=1;fi(a,b,c,e);return b.child}
function pi(a,b,c,d,e){if(Ff(c)){var f=!0;Jf(b)}else f=!1;tg(b,e);if(null===b.stateNode)null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2),Mg(b,c,d),Og(b,c,d,e),d=!0;else if(null===a){var g=b.stateNode,h=b.memoizedProps;g.props=h;var k=g.context,l=c.contextType;"object"===typeof l&&null!==l?l=vg(l):(l=Ff(c)?Df:M.current,l=Ef(b,l));var n=c.getDerivedStateFromProps,A="function"===typeof n||"function"===typeof g.getSnapshotBeforeUpdate;A||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&
"function"!==typeof g.componentWillReceiveProps||(h!==d||k!==l)&&Ng(b,g,d,l);wg=!1;var p=b.memoizedState;g.state=p;Cg(b,d,g,e);k=b.memoizedState;h!==d||p!==k||N.current||wg?("function"===typeof n&&(Gg(b,c,n,d),k=b.memoizedState),(h=wg||Lg(b,c,h,d,p,k,l))?(A||"function"!==typeof g.UNSAFE_componentWillMount&&"function"!==typeof g.componentWillMount||("function"===typeof g.componentWillMount&&g.componentWillMount(),"function"===typeof g.UNSAFE_componentWillMount&&g.UNSAFE_componentWillMount()),"function"===
typeof g.componentDidMount&&(b.flags|=4)):("function"===typeof g.componentDidMount&&(b.flags|=4),b.memoizedProps=d,b.memoizedState=k),g.props=d,g.state=k,g.context=l,d=h):("function"===typeof g.componentDidMount&&(b.flags|=4),d=!1)}else{g=b.stateNode;yg(a,b);h=b.memoizedProps;l=b.type===b.elementType?h:lg(b.type,h);g.props=l;A=b.pendingProps;p=g.context;k=c.contextType;"object"===typeof k&&null!==k?k=vg(k):(k=Ff(c)?Df:M.current,k=Ef(b,k));var C=c.getDerivedStateFromProps;(n="function"===typeof C||
"function"===typeof g.getSnapshotBeforeUpdate)||"function"!==typeof g.UNSAFE_componentWillReceiveProps&&"function"!==typeof g.componentWillReceiveProps||(h!==A||p!==k)&&Ng(b,g,d,k);wg=!1;p=b.memoizedState;g.state=p;Cg(b,d,g,e);var x=b.memoizedState;h!==A||p!==x||N.current||wg?("function"===typeof C&&(Gg(b,c,C,d),x=b.memoizedState),(l=wg||Lg(b,c,l,d,p,x,k))?(n||"function"!==typeof g.UNSAFE_componentWillUpdate&&"function"!==typeof g.componentWillUpdate||("function"===typeof g.componentWillUpdate&&g.componentWillUpdate(d,
x,k),"function"===typeof g.UNSAFE_componentWillUpdate&&g.UNSAFE_componentWillUpdate(d,x,k)),"function"===typeof g.componentDidUpdate&&(b.flags|=4),"function"===typeof g.getSnapshotBeforeUpdate&&(b.flags|=256)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=256),b.memoizedProps=d,b.memoizedState=x),g.props=d,g.state=x,g.context=k,d=l):("function"!==typeof g.componentDidUpdate||
h===a.memoizedProps&&p===a.memoizedState||(b.flags|=4),"function"!==typeof g.getSnapshotBeforeUpdate||h===a.memoizedProps&&p===a.memoizedState||(b.flags|=256),d=!1)}return qi(a,b,c,d,f,e)}
function qi(a,b,c,d,e,f){oi(a,b);var g=0!==(b.flags&64);if(!d&&!g)return e&&Kf(b,c,!1),hi(a,b,f);d=b.stateNode;ei.current=b;var h=g&&"function"!==typeof c.getDerivedStateFromError?null:d.render();b.flags|=1;null!==a&&g?(b.child=Yg(b,a.child,null,f),b.child=Yg(b,null,h,f)):fi(a,b,h,f);b.memoizedState=d.state;e&&Kf(b,c,!0);return b.child}function ri(a){var b=a.stateNode;b.pendingContext?Hf(a,b.pendingContext,b.pendingContext!==b.context):b.context&&Hf(a,b.context,!1);eh(a,b.containerInfo)}
var si={dehydrated:null,retryLane:0};
function ti(a,b,c){var d=b.pendingProps,e=P.current,f=!1,g;(g=0!==(b.flags&64))||(g=null!==a&&null===a.memoizedState?!1:0!==(e&2));g?(f=!0,b.flags&=-65):null!==a&&null===a.memoizedState||void 0===d.fallback||!0===d.unstable_avoidThisFallback||(e|=1);I(P,e&1);if(null===a){void 0!==d.fallback&&ph(b);a=d.children;e=d.fallback;if(f)return a=ui(b,a,e,c),b.child.memoizedState={baseLanes:c},b.memoizedState=si,a;if("number"===typeof d.unstable_expectedLoadTime)return a=ui(b,a,e,c),b.child.memoizedState={baseLanes:c},
b.memoizedState=si,b.lanes=33554432,a;c=vi({mode:"visible",children:a},b.mode,c,null);c.return=b;return b.child=c}if(null!==a.memoizedState){if(f)return d=wi(a,b,d.children,d.fallback,c),f=b.child,e=a.child.memoizedState,f.memoizedState=null===e?{baseLanes:c}:{baseLanes:e.baseLanes|c},f.childLanes=a.childLanes&~c,b.memoizedState=si,d;c=xi(a,b,d.children,c);b.memoizedState=null;return c}if(f)return d=wi(a,b,d.children,d.fallback,c),f=b.child,e=a.child.memoizedState,f.memoizedState=null===e?{baseLanes:c}:
{baseLanes:e.baseLanes|c},f.childLanes=a.childLanes&~c,b.memoizedState=si,d;c=xi(a,b,d.children,c);b.memoizedState=null;return c}function ui(a,b,c,d){var e=a.mode,f=a.child;b={mode:"hidden",children:b};0===(e&2)&&null!==f?(f.childLanes=0,f.pendingProps=b):f=vi(b,e,0,null);c=Xg(c,e,d,null);f.return=a;c.return=a;f.sibling=c;a.child=f;return c}
function xi(a,b,c,d){var e=a.child;a=e.sibling;c=Tg(e,{mode:"visible",children:c});0===(b.mode&2)&&(c.lanes=d);c.return=b;c.sibling=null;null!==a&&(a.nextEffect=null,a.flags=8,b.firstEffect=b.lastEffect=a);return b.child=c}
function wi(a,b,c,d,e){var f=b.mode,g=a.child;a=g.sibling;var h={mode:"hidden",children:c};0===(f&2)&&b.child!==g?(c=b.child,c.childLanes=0,c.pendingProps=h,g=c.lastEffect,null!==g?(b.firstEffect=c.firstEffect,b.lastEffect=g,g.nextEffect=null):b.firstEffect=b.lastEffect=null):c=Tg(g,h);null!==a?d=Tg(a,d):(d=Xg(d,f,e,null),d.flags|=2);d.return=b;c.return=b;c.sibling=d;b.child=c;return d}function yi(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);sg(a.return,b)}
function zi(a,b,c,d,e,f){var g=a.memoizedState;null===g?a.memoizedState={isBackwards:b,rendering:null,renderingStartTime:0,last:d,tail:c,tailMode:e,lastEffect:f}:(g.isBackwards=b,g.rendering=null,g.renderingStartTime=0,g.last=d,g.tail=c,g.tailMode=e,g.lastEffect=f)}
function Ai(a,b,c){var d=b.pendingProps,e=d.revealOrder,f=d.tail;fi(a,b,d.children,c);d=P.current;if(0!==(d&2))d=d&1|2,b.flags|=64;else{if(null!==a&&0!==(a.flags&64))a:for(a=b.child;null!==a;){if(13===a.tag)null!==a.memoizedState&&yi(a,c);else if(19===a.tag)yi(a,c);else if(null!==a.child){a.child.return=a;a=a.child;continue}if(a===b)break a;for(;null===a.sibling;){if(null===a.return||a.return===b)break a;a=a.return}a.sibling.return=a.return;a=a.sibling}d&=1}I(P,d);if(0===(b.mode&2))b.memoizedState=
null;else switch(e){case "forwards":c=b.child;for(e=null;null!==c;)a=c.alternate,null!==a&&null===ih(a)&&(e=c),c=c.sibling;c=e;null===c?(e=b.child,b.child=null):(e=c.sibling,c.sibling=null);zi(b,!1,e,c,f,b.lastEffect);break;case "backwards":c=null;e=b.child;for(b.child=null;null!==e;){a=e.alternate;if(null!==a&&null===ih(a)){b.child=e;break}a=e.sibling;e.sibling=c;c=e;e=a}zi(b,!0,c,null,f,b.lastEffect);break;case "together":zi(b,!1,null,null,void 0,b.lastEffect);break;default:b.memoizedState=null}return b.child}
function hi(a,b,c){null!==a&&(b.dependencies=a.dependencies);Dg|=b.lanes;if(0!==(c&b.childLanes)){if(null!==a&&b.child!==a.child)throw Error(y(153));if(null!==b.child){a=b.child;c=Tg(a,a.pendingProps);b.child=c;for(c.return=b;null!==a.sibling;)a=a.sibling,c=c.sibling=Tg(a,a.pendingProps),c.return=b;c.sibling=null}return b.child}return null}var Bi,Ci,Di,Ei;
Bi=function(a,b){for(var c=b.child;null!==c;){if(5===c.tag||6===c.tag)a.appendChild(c.stateNode);else if(4!==c.tag&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return}c.sibling.return=c.return;c=c.sibling}};Ci=function(){};
Di=function(a,b,c,d){var e=a.memoizedProps;if(e!==d){a=b.stateNode;dh(ah.current);var f=null;switch(c){case "input":e=Ya(a,e);d=Ya(a,d);f=[];break;case "option":e=eb(a,e);d=eb(a,d);f=[];break;case "select":e=m({},e,{value:void 0});d=m({},d,{value:void 0});f=[];break;case "textarea":e=gb(a,e);d=gb(a,d);f=[];break;default:"function"!==typeof e.onClick&&"function"===typeof d.onClick&&(a.onclick=jf)}vb(c,d);var g;c=null;for(l in e)if(!d.hasOwnProperty(l)&&e.hasOwnProperty(l)&&null!=e[l])if("style"===
l){var h=e[l];for(g in h)h.hasOwnProperty(g)&&(c||(c={}),c[g]="")}else"dangerouslySetInnerHTML"!==l&&"children"!==l&&"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&"autoFocus"!==l&&(ca.hasOwnProperty(l)?f||(f=[]):(f=f||[]).push(l,null));for(l in d){var k=d[l];h=null!=e?e[l]:void 0;if(d.hasOwnProperty(l)&&k!==h&&(null!=k||null!=h))if("style"===l)if(h){for(g in h)!h.hasOwnProperty(g)||k&&k.hasOwnProperty(g)||(c||(c={}),c[g]="");for(g in k)k.hasOwnProperty(g)&&h[g]!==k[g]&&(c||
(c={}),c[g]=k[g])}else c||(f||(f=[]),f.push(l,c)),c=k;else"dangerouslySetInnerHTML"===l?(k=k?k.__html:void 0,h=h?h.__html:void 0,null!=k&&h!==k&&(f=f||[]).push(l,k)):"children"===l?"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(l,""+k):"suppressContentEditableWarning"!==l&&"suppressHydrationWarning"!==l&&(ca.hasOwnProperty(l)?(null!=k&&"onScroll"===l&&G("scroll",a),f||h===k||(f=[])):"object"===typeof k&&null!==k&&k.$$typeof===Ga?k.toString():(f=f||[]).push(l,k))}c&&(f=f||[]).push("style",
c);var l=f;if(b.updateQueue=l)b.flags|=4}};Ei=function(a,b,c,d){c!==d&&(b.flags|=4)};function Fi(a,b){if(!lh)switch(a.tailMode){case "hidden":b=a.tail;for(var c=null;null!==b;)null!==b.alternate&&(c=b),b=b.sibling;null===c?a.tail=null:c.sibling=null;break;case "collapsed":c=a.tail;for(var d=null;null!==c;)null!==c.alternate&&(d=c),c=c.sibling;null===d?b||null===a.tail?a.tail=null:a.tail.sibling=null:d.sibling=null}}
function Gi(a,b,c){var d=b.pendingProps;switch(b.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return null;case 1:return Ff(b.type)&&Gf(),null;case 3:fh();H(N);H(M);uh();d=b.stateNode;d.pendingContext&&(d.context=d.pendingContext,d.pendingContext=null);if(null===a||null===a.child)rh(b)?b.flags|=4:d.hydrate||(b.flags|=256);Ci(b);return null;case 5:hh(b);var e=dh(ch.current);c=b.type;if(null!==a&&null!=b.stateNode)Di(a,b,c,d,e),a.ref!==b.ref&&(b.flags|=128);else{if(!d){if(null===
b.stateNode)throw Error(y(166));return null}a=dh(ah.current);if(rh(b)){d=b.stateNode;c=b.type;var f=b.memoizedProps;d[wf]=b;d[xf]=f;switch(c){case "dialog":G("cancel",d);G("close",d);break;case "iframe":case "object":case "embed":G("load",d);break;case "video":case "audio":for(a=0;a<Xe.length;a++)G(Xe[a],d);break;case "source":G("error",d);break;case "img":case "image":case "link":G("error",d);G("load",d);break;case "details":G("toggle",d);break;case "input":Za(d,f);G("invalid",d);break;case "select":d._wrapperState=
{wasMultiple:!!f.multiple};G("invalid",d);break;case "textarea":hb(d,f),G("invalid",d)}vb(c,f);a=null;for(var g in f)f.hasOwnProperty(g)&&(e=f[g],"children"===g?"string"===typeof e?d.textContent!==e&&(a=["children",e]):"number"===typeof e&&d.textContent!==""+e&&(a=["children",""+e]):ca.hasOwnProperty(g)&&null!=e&&"onScroll"===g&&G("scroll",d));switch(c){case "input":Va(d);cb(d,f,!0);break;case "textarea":Va(d);jb(d);break;case "select":case "option":break;default:"function"===typeof f.onClick&&(d.onclick=
jf)}d=a;b.updateQueue=d;null!==d&&(b.flags|=4)}else{g=9===e.nodeType?e:e.ownerDocument;a===kb.html&&(a=lb(c));a===kb.html?"script"===c?(a=g.createElement("div"),a.innerHTML="<script>\x3c/script>",a=a.removeChild(a.firstChild)):"string"===typeof d.is?a=g.createElement(c,{is:d.is}):(a=g.createElement(c),"select"===c&&(g=a,d.multiple?g.multiple=!0:d.size&&(g.size=d.size))):a=g.createElementNS(a,c);a[wf]=b;a[xf]=d;Bi(a,b,!1,!1);b.stateNode=a;g=wb(c,d);switch(c){case "dialog":G("cancel",a);G("close",a);
e=d;break;case "iframe":case "object":case "embed":G("load",a);e=d;break;case "video":case "audio":for(e=0;e<Xe.length;e++)G(Xe[e],a);e=d;break;case "source":G("error",a);e=d;break;case "img":case "image":case "link":G("error",a);G("load",a);e=d;break;case "details":G("toggle",a);e=d;break;case "input":Za(a,d);e=Ya(a,d);G("invalid",a);break;case "option":e=eb(a,d);break;case "select":a._wrapperState={wasMultiple:!!d.multiple};e=m({},d,{value:void 0});G("invalid",a);break;case "textarea":hb(a,d);e=
gb(a,d);G("invalid",a);break;default:e=d}vb(c,e);var h=e;for(f in h)if(h.hasOwnProperty(f)){var k=h[f];"style"===f?tb(a,k):"dangerouslySetInnerHTML"===f?(k=k?k.__html:void 0,null!=k&&ob(a,k)):"children"===f?"string"===typeof k?("textarea"!==c||""!==k)&&pb(a,k):"number"===typeof k&&pb(a,""+k):"suppressContentEditableWarning"!==f&&"suppressHydrationWarning"!==f&&"autoFocus"!==f&&(ca.hasOwnProperty(f)?null!=k&&"onScroll"===f&&G("scroll",a):null!=k&&qa(a,f,k,g))}switch(c){case "input":Va(a);cb(a,d,!1);
break;case "textarea":Va(a);jb(a);break;case "option":null!=d.value&&a.setAttribute("value",""+Sa(d.value));break;case "select":a.multiple=!!d.multiple;f=d.value;null!=f?fb(a,!!d.multiple,f,!1):null!=d.defaultValue&&fb(a,!!d.multiple,d.defaultValue,!0);break;default:"function"===typeof e.onClick&&(a.onclick=jf)}mf(c,d)&&(b.flags|=4)}null!==b.ref&&(b.flags|=128)}return null;case 6:if(a&&null!=b.stateNode)Ei(a,b,a.memoizedProps,d);else{if("string"!==typeof d&&null===b.stateNode)throw Error(y(166));
c=dh(ch.current);dh(ah.current);rh(b)?(d=b.stateNode,c=b.memoizedProps,d[wf]=b,d.nodeValue!==c&&(b.flags|=4)):(d=(9===c.nodeType?c:c.ownerDocument).createTextNode(d),d[wf]=b,b.stateNode=d)}return null;case 13:H(P);d=b.memoizedState;if(0!==(b.flags&64))return b.lanes=c,b;d=null!==d;c=!1;null===a?void 0!==b.memoizedProps.fallback&&rh(b):c=null!==a.memoizedState;if(d&&!c&&0!==(b.mode&2))if(null===a&&!0!==b.memoizedProps.unstable_avoidThisFallback||0!==(P.current&1))0===V&&(V=3);else{if(0===V||3===V)V=
4;null===U||0===(Dg&134217727)&&0===(Hi&134217727)||Ii(U,W)}if(d||c)b.flags|=4;return null;case 4:return fh(),Ci(b),null===a&&cf(b.stateNode.containerInfo),null;case 10:return rg(b),null;case 17:return Ff(b.type)&&Gf(),null;case 19:H(P);d=b.memoizedState;if(null===d)return null;f=0!==(b.flags&64);g=d.rendering;if(null===g)if(f)Fi(d,!1);else{if(0!==V||null!==a&&0!==(a.flags&64))for(a=b.child;null!==a;){g=ih(a);if(null!==g){b.flags|=64;Fi(d,!1);f=g.updateQueue;null!==f&&(b.updateQueue=f,b.flags|=4);
null===d.lastEffect&&(b.firstEffect=null);b.lastEffect=d.lastEffect;d=c;for(c=b.child;null!==c;)f=c,a=d,f.flags&=2,f.nextEffect=null,f.firstEffect=null,f.lastEffect=null,g=f.alternate,null===g?(f.childLanes=0,f.lanes=a,f.child=null,f.memoizedProps=null,f.memoizedState=null,f.updateQueue=null,f.dependencies=null,f.stateNode=null):(f.childLanes=g.childLanes,f.lanes=g.lanes,f.child=g.child,f.memoizedProps=g.memoizedProps,f.memoizedState=g.memoizedState,f.updateQueue=g.updateQueue,f.type=g.type,a=g.dependencies,
f.dependencies=null===a?null:{lanes:a.lanes,firstContext:a.firstContext}),c=c.sibling;I(P,P.current&1|2);return b.child}a=a.sibling}null!==d.tail&&O()>Ji&&(b.flags|=64,f=!0,Fi(d,!1),b.lanes=33554432)}else{if(!f)if(a=ih(g),null!==a){if(b.flags|=64,f=!0,c=a.updateQueue,null!==c&&(b.updateQueue=c,b.flags|=4),Fi(d,!0),null===d.tail&&"hidden"===d.tailMode&&!g.alternate&&!lh)return b=b.lastEffect=d.lastEffect,null!==b&&(b.nextEffect=null),null}else 2*O()-d.renderingStartTime>Ji&&1073741824!==c&&(b.flags|=
64,f=!0,Fi(d,!1),b.lanes=33554432);d.isBackwards?(g.sibling=b.child,b.child=g):(c=d.last,null!==c?c.sibling=g:b.child=g,d.last=g)}return null!==d.tail?(c=d.tail,d.rendering=c,d.tail=c.sibling,d.lastEffect=b.lastEffect,d.renderingStartTime=O(),c.sibling=null,b=P.current,I(P,f?b&1|2:b&1),c):null;case 23:case 24:return Ki(),null!==a&&null!==a.memoizedState!==(null!==b.memoizedState)&&"unstable-defer-without-hiding"!==d.mode&&(b.flags|=4),null}throw Error(y(156,b.tag));}
function Li(a){switch(a.tag){case 1:Ff(a.type)&&Gf();var b=a.flags;return b&4096?(a.flags=b&-4097|64,a):null;case 3:fh();H(N);H(M);uh();b=a.flags;if(0!==(b&64))throw Error(y(285));a.flags=b&-4097|64;return a;case 5:return hh(a),null;case 13:return H(P),b=a.flags,b&4096?(a.flags=b&-4097|64,a):null;case 19:return H(P),null;case 4:return fh(),null;case 10:return rg(a),null;case 23:case 24:return Ki(),null;default:return null}}
function Mi(a,b){try{var c="",d=b;do c+=Qa(d),d=d.return;while(d);var e=c}catch(f){e="\nError generating stack: "+f.message+"\n"+f.stack}return{value:a,source:b,stack:e}}function Ni(a,b){try{console.error(b.value)}catch(c){setTimeout(function(){throw c;})}}var Oi="function"===typeof WeakMap?WeakMap:Map;function Pi(a,b,c){c=zg(-1,c);c.tag=3;c.payload={element:null};var d=b.value;c.callback=function(){Qi||(Qi=!0,Ri=d);Ni(a,b)};return c}
function Si(a,b,c){c=zg(-1,c);c.tag=3;var d=a.type.getDerivedStateFromError;if("function"===typeof d){var e=b.value;c.payload=function(){Ni(a,b);return d(e)}}var f=a.stateNode;null!==f&&"function"===typeof f.componentDidCatch&&(c.callback=function(){"function"!==typeof d&&(null===Ti?Ti=new Set([this]):Ti.add(this),Ni(a,b));var c=b.stack;this.componentDidCatch(b.value,{componentStack:null!==c?c:""})});return c}var Ui="function"===typeof WeakSet?WeakSet:Set;
function Vi(a){var b=a.ref;if(null!==b)if("function"===typeof b)try{b(null)}catch(c){Wi(a,c)}else b.current=null}function Xi(a,b){switch(b.tag){case 0:case 11:case 15:case 22:return;case 1:if(b.flags&256&&null!==a){var c=a.memoizedProps,d=a.memoizedState;a=b.stateNode;b=a.getSnapshotBeforeUpdate(b.elementType===b.type?c:lg(b.type,c),d);a.__reactInternalSnapshotBeforeUpdate=b}return;case 3:b.flags&256&&qf(b.stateNode.containerInfo);return;case 5:case 6:case 4:case 17:return}throw Error(y(163));}
function Yi(a,b,c){switch(c.tag){case 0:case 11:case 15:case 22:b=c.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){a=b=b.next;do{if(3===(a.tag&3)){var d=a.create;a.destroy=d()}a=a.next}while(a!==b)}b=c.updateQueue;b=null!==b?b.lastEffect:null;if(null!==b){a=b=b.next;do{var e=a;d=e.next;e=e.tag;0!==(e&4)&&0!==(e&1)&&(Zi(c,a),$i(c,a));a=d}while(a!==b)}return;case 1:a=c.stateNode;c.flags&4&&(null===b?a.componentDidMount():(d=c.elementType===c.type?b.memoizedProps:lg(c.type,b.memoizedProps),a.componentDidUpdate(d,
b.memoizedState,a.__reactInternalSnapshotBeforeUpdate)));b=c.updateQueue;null!==b&&Eg(c,b,a);return;case 3:b=c.updateQueue;if(null!==b){a=null;if(null!==c.child)switch(c.child.tag){case 5:a=c.child.stateNode;break;case 1:a=c.child.stateNode}Eg(c,b,a)}return;case 5:a=c.stateNode;null===b&&c.flags&4&&mf(c.type,c.memoizedProps)&&a.focus();return;case 6:return;case 4:return;case 12:return;case 13:null===c.memoizedState&&(c=c.alternate,null!==c&&(c=c.memoizedState,null!==c&&(c=c.dehydrated,null!==c&&Cc(c))));
return;case 19:case 17:case 20:case 21:case 23:case 24:return}throw Error(y(163));}
function aj(a,b){for(var c=a;;){if(5===c.tag){var d=c.stateNode;if(b)d=d.style,"function"===typeof d.setProperty?d.setProperty("display","none","important"):d.display="none";else{d=c.stateNode;var e=c.memoizedProps.style;e=void 0!==e&&null!==e&&e.hasOwnProperty("display")?e.display:null;d.style.display=sb("display",e)}}else if(6===c.tag)c.stateNode.nodeValue=b?"":c.memoizedProps;else if((23!==c.tag&&24!==c.tag||null===c.memoizedState||c===a)&&null!==c.child){c.child.return=c;c=c.child;continue}if(c===
a)break;for(;null===c.sibling;){if(null===c.return||c.return===a)return;c=c.return}c.sibling.return=c.return;c=c.sibling}}
function bj(a,b){if(Mf&&"function"===typeof Mf.onCommitFiberUnmount)try{Mf.onCommitFiberUnmount(Lf,b)}catch(f){}switch(b.tag){case 0:case 11:case 14:case 15:case 22:a=b.updateQueue;if(null!==a&&(a=a.lastEffect,null!==a)){var c=a=a.next;do{var d=c,e=d.destroy;d=d.tag;if(void 0!==e)if(0!==(d&4))Zi(b,c);else{d=b;try{e()}catch(f){Wi(d,f)}}c=c.next}while(c!==a)}break;case 1:Vi(b);a=b.stateNode;if("function"===typeof a.componentWillUnmount)try{a.props=b.memoizedProps,a.state=b.memoizedState,a.componentWillUnmount()}catch(f){Wi(b,
f)}break;case 5:Vi(b);break;case 4:cj(a,b)}}function dj(a){a.alternate=null;a.child=null;a.dependencies=null;a.firstEffect=null;a.lastEffect=null;a.memoizedProps=null;a.memoizedState=null;a.pendingProps=null;a.return=null;a.updateQueue=null}function ej(a){return 5===a.tag||3===a.tag||4===a.tag}
function fj(a){a:{for(var b=a.return;null!==b;){if(ej(b))break a;b=b.return}throw Error(y(160));}var c=b;b=c.stateNode;switch(c.tag){case 5:var d=!1;break;case 3:b=b.containerInfo;d=!0;break;case 4:b=b.containerInfo;d=!0;break;default:throw Error(y(161));}c.flags&16&&(pb(b,""),c.flags&=-17);a:b:for(c=a;;){for(;null===c.sibling;){if(null===c.return||ej(c.return)){c=null;break a}c=c.return}c.sibling.return=c.return;for(c=c.sibling;5!==c.tag&&6!==c.tag&&18!==c.tag;){if(c.flags&2)continue b;if(null===
c.child||4===c.tag)continue b;else c.child.return=c,c=c.child}if(!(c.flags&2)){c=c.stateNode;break a}}d?gj(a,c,b):hj(a,c,b)}
function gj(a,b,c){var d=a.tag,e=5===d||6===d;if(e)a=e?a.stateNode:a.stateNode.instance,b?8===c.nodeType?c.parentNode.insertBefore(a,b):c.insertBefore(a,b):(8===c.nodeType?(b=c.parentNode,b.insertBefore(a,c)):(b=c,b.appendChild(a)),c=c._reactRootContainer,null!==c&&void 0!==c||null!==b.onclick||(b.onclick=jf));else if(4!==d&&(a=a.child,null!==a))for(gj(a,b,c),a=a.sibling;null!==a;)gj(a,b,c),a=a.sibling}
function hj(a,b,c){var d=a.tag,e=5===d||6===d;if(e)a=e?a.stateNode:a.stateNode.instance,b?c.insertBefore(a,b):c.appendChild(a);else if(4!==d&&(a=a.child,null!==a))for(hj(a,b,c),a=a.sibling;null!==a;)hj(a,b,c),a=a.sibling}
function cj(a,b){for(var c=b,d=!1,e,f;;){if(!d){d=c.return;a:for(;;){if(null===d)throw Error(y(160));e=d.stateNode;switch(d.tag){case 5:f=!1;break a;case 3:e=e.containerInfo;f=!0;break a;case 4:e=e.containerInfo;f=!0;break a}d=d.return}d=!0}if(5===c.tag||6===c.tag){a:for(var g=a,h=c,k=h;;)if(bj(g,k),null!==k.child&&4!==k.tag)k.child.return=k,k=k.child;else{if(k===h)break a;for(;null===k.sibling;){if(null===k.return||k.return===h)break a;k=k.return}k.sibling.return=k.return;k=k.sibling}f?(g=e,h=c.stateNode,
8===g.nodeType?g.parentNode.removeChild(h):g.removeChild(h)):e.removeChild(c.stateNode)}else if(4===c.tag){if(null!==c.child){e=c.stateNode.containerInfo;f=!0;c.child.return=c;c=c.child;continue}}else if(bj(a,c),null!==c.child){c.child.return=c;c=c.child;continue}if(c===b)break;for(;null===c.sibling;){if(null===c.return||c.return===b)return;c=c.return;4===c.tag&&(d=!1)}c.sibling.return=c.return;c=c.sibling}}
function ij(a,b){switch(b.tag){case 0:case 11:case 14:case 15:case 22:var c=b.updateQueue;c=null!==c?c.lastEffect:null;if(null!==c){var d=c=c.next;do 3===(d.tag&3)&&(a=d.destroy,d.destroy=void 0,void 0!==a&&a()),d=d.next;while(d!==c)}return;case 1:return;case 5:c=b.stateNode;if(null!=c){d=b.memoizedProps;var e=null!==a?a.memoizedProps:d;a=b.type;var f=b.updateQueue;b.updateQueue=null;if(null!==f){c[xf]=d;"input"===a&&"radio"===d.type&&null!=d.name&&$a(c,d);wb(a,e);b=wb(a,d);for(e=0;e<f.length;e+=
2){var g=f[e],h=f[e+1];"style"===g?tb(c,h):"dangerouslySetInnerHTML"===g?ob(c,h):"children"===g?pb(c,h):qa(c,g,h,b)}switch(a){case "input":ab(c,d);break;case "textarea":ib(c,d);break;case "select":a=c._wrapperState.wasMultiple,c._wrapperState.wasMultiple=!!d.multiple,f=d.value,null!=f?fb(c,!!d.multiple,f,!1):a!==!!d.multiple&&(null!=d.defaultValue?fb(c,!!d.multiple,d.defaultValue,!0):fb(c,!!d.multiple,d.multiple?[]:"",!1))}}}return;case 6:if(null===b.stateNode)throw Error(y(162));b.stateNode.nodeValue=
b.memoizedProps;return;case 3:c=b.stateNode;c.hydrate&&(c.hydrate=!1,Cc(c.containerInfo));return;case 12:return;case 13:null!==b.memoizedState&&(jj=O(),aj(b.child,!0));kj(b);return;case 19:kj(b);return;case 17:return;case 23:case 24:aj(b,null!==b.memoizedState);return}throw Error(y(163));}function kj(a){var b=a.updateQueue;if(null!==b){a.updateQueue=null;var c=a.stateNode;null===c&&(c=a.stateNode=new Ui);b.forEach(function(b){var d=lj.bind(null,a,b);c.has(b)||(c.add(b),b.then(d,d))})}}
function mj(a,b){return null!==a&&(a=a.memoizedState,null===a||null!==a.dehydrated)?(b=b.memoizedState,null!==b&&null===b.dehydrated):!1}var nj=Math.ceil,oj=ra.ReactCurrentDispatcher,pj=ra.ReactCurrentOwner,X=0,U=null,Y=null,W=0,qj=0,rj=Bf(0),V=0,sj=null,tj=0,Dg=0,Hi=0,uj=0,vj=null,jj=0,Ji=Infinity;function wj(){Ji=O()+500}var Z=null,Qi=!1,Ri=null,Ti=null,xj=!1,yj=null,zj=90,Aj=[],Bj=[],Cj=null,Dj=0,Ej=null,Fj=-1,Gj=0,Hj=0,Ij=null,Jj=!1;function Hg(){return 0!==(X&48)?O():-1!==Fj?Fj:Fj=O()}
function Ig(a){a=a.mode;if(0===(a&2))return 1;if(0===(a&4))return 99===eg()?1:2;0===Gj&&(Gj=tj);if(0!==kg.transition){0!==Hj&&(Hj=null!==vj?vj.pendingLanes:0);a=Gj;var b=4186112&~Hj;b&=-b;0===b&&(a=4186112&~a,b=a&-a,0===b&&(b=8192));return b}a=eg();0!==(X&4)&&98===a?a=Xc(12,Gj):(a=Sc(a),a=Xc(a,Gj));return a}
function Jg(a,b,c){if(50<Dj)throw Dj=0,Ej=null,Error(y(185));a=Kj(a,b);if(null===a)return null;$c(a,b,c);a===U&&(Hi|=b,4===V&&Ii(a,W));var d=eg();1===b?0!==(X&8)&&0===(X&48)?Lj(a):(Mj(a,c),0===X&&(wj(),ig())):(0===(X&4)||98!==d&&99!==d||(null===Cj?Cj=new Set([a]):Cj.add(a)),Mj(a,c));vj=a}function Kj(a,b){a.lanes|=b;var c=a.alternate;null!==c&&(c.lanes|=b);c=a;for(a=a.return;null!==a;)a.childLanes|=b,c=a.alternate,null!==c&&(c.childLanes|=b),c=a,a=a.return;return 3===c.tag?c.stateNode:null}
function Mj(a,b){for(var c=a.callbackNode,d=a.suspendedLanes,e=a.pingedLanes,f=a.expirationTimes,g=a.pendingLanes;0<g;){var h=31-Vc(g),k=1<<h,l=f[h];if(-1===l){if(0===(k&d)||0!==(k&e)){l=b;Rc(k);var n=F;f[h]=10<=n?l+250:6<=n?l+5E3:-1}}else l<=b&&(a.expiredLanes|=k);g&=~k}d=Uc(a,a===U?W:0);b=F;if(0===d)null!==c&&(c!==Zf&&Pf(c),a.callbackNode=null,a.callbackPriority=0);else{if(null!==c){if(a.callbackPriority===b)return;c!==Zf&&Pf(c)}15===b?(c=Lj.bind(null,a),null===ag?(ag=[c],bg=Of(Uf,jg)):ag.push(c),
c=Zf):14===b?c=hg(99,Lj.bind(null,a)):(c=Tc(b),c=hg(c,Nj.bind(null,a)));a.callbackPriority=b;a.callbackNode=c}}
function Nj(a){Fj=-1;Hj=Gj=0;if(0!==(X&48))throw Error(y(327));var b=a.callbackNode;if(Oj()&&a.callbackNode!==b)return null;var c=Uc(a,a===U?W:0);if(0===c)return null;var d=c;var e=X;X|=16;var f=Pj();if(U!==a||W!==d)wj(),Qj(a,d);do try{Rj();break}catch(h){Sj(a,h)}while(1);qg();oj.current=f;X=e;null!==Y?d=0:(U=null,W=0,d=V);if(0!==(tj&Hi))Qj(a,0);else if(0!==d){2===d&&(X|=64,a.hydrate&&(a.hydrate=!1,qf(a.containerInfo)),c=Wc(a),0!==c&&(d=Tj(a,c)));if(1===d)throw b=sj,Qj(a,0),Ii(a,c),Mj(a,O()),b;a.finishedWork=
a.current.alternate;a.finishedLanes=c;switch(d){case 0:case 1:throw Error(y(345));case 2:Uj(a);break;case 3:Ii(a,c);if((c&62914560)===c&&(d=jj+500-O(),10<d)){if(0!==Uc(a,0))break;e=a.suspendedLanes;if((e&c)!==c){Hg();a.pingedLanes|=a.suspendedLanes&e;break}a.timeoutHandle=of(Uj.bind(null,a),d);break}Uj(a);break;case 4:Ii(a,c);if((c&4186112)===c)break;d=a.eventTimes;for(e=-1;0<c;){var g=31-Vc(c);f=1<<g;g=d[g];g>e&&(e=g);c&=~f}c=e;c=O()-c;c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3E3>c?3E3:4320>
c?4320:1960*nj(c/1960))-c;if(10<c){a.timeoutHandle=of(Uj.bind(null,a),c);break}Uj(a);break;case 5:Uj(a);break;default:throw Error(y(329));}}Mj(a,O());return a.callbackNode===b?Nj.bind(null,a):null}function Ii(a,b){b&=~uj;b&=~Hi;a.suspendedLanes|=b;a.pingedLanes&=~b;for(a=a.expirationTimes;0<b;){var c=31-Vc(b),d=1<<c;a[c]=-1;b&=~d}}
function Lj(a){if(0!==(X&48))throw Error(y(327));Oj();if(a===U&&0!==(a.expiredLanes&W)){var b=W;var c=Tj(a,b);0!==(tj&Hi)&&(b=Uc(a,b),c=Tj(a,b))}else b=Uc(a,0),c=Tj(a,b);0!==a.tag&&2===c&&(X|=64,a.hydrate&&(a.hydrate=!1,qf(a.containerInfo)),b=Wc(a),0!==b&&(c=Tj(a,b)));if(1===c)throw c=sj,Qj(a,0),Ii(a,b),Mj(a,O()),c;a.finishedWork=a.current.alternate;a.finishedLanes=b;Uj(a);Mj(a,O());return null}
function Vj(){if(null!==Cj){var a=Cj;Cj=null;a.forEach(function(a){a.expiredLanes|=24&a.pendingLanes;Mj(a,O())})}ig()}function Wj(a,b){var c=X;X|=1;try{return a(b)}finally{X=c,0===X&&(wj(),ig())}}function Xj(a,b){var c=X;X&=-2;X|=8;try{return a(b)}finally{X=c,0===X&&(wj(),ig())}}function ni(a,b){I(rj,qj);qj|=b;tj|=b}function Ki(){qj=rj.current;H(rj)}
function Qj(a,b){a.finishedWork=null;a.finishedLanes=0;var c=a.timeoutHandle;-1!==c&&(a.timeoutHandle=-1,pf(c));if(null!==Y)for(c=Y.return;null!==c;){var d=c;switch(d.tag){case 1:d=d.type.childContextTypes;null!==d&&void 0!==d&&Gf();break;case 3:fh();H(N);H(M);uh();break;case 5:hh(d);break;case 4:fh();break;case 13:H(P);break;case 19:H(P);break;case 10:rg(d);break;case 23:case 24:Ki()}c=c.return}U=a;Y=Tg(a.current,null);W=qj=tj=b;V=0;sj=null;uj=Hi=Dg=0}
function Sj(a,b){do{var c=Y;try{qg();vh.current=Gh;if(yh){for(var d=R.memoizedState;null!==d;){var e=d.queue;null!==e&&(e.pending=null);d=d.next}yh=!1}xh=0;T=S=R=null;zh=!1;pj.current=null;if(null===c||null===c.return){V=1;sj=b;Y=null;break}a:{var f=a,g=c.return,h=c,k=b;b=W;h.flags|=2048;h.firstEffect=h.lastEffect=null;if(null!==k&&"object"===typeof k&&"function"===typeof k.then){var l=k;if(0===(h.mode&2)){var n=h.alternate;n?(h.updateQueue=n.updateQueue,h.memoizedState=n.memoizedState,h.lanes=n.lanes):
(h.updateQueue=null,h.memoizedState=null)}var A=0!==(P.current&1),p=g;do{var C;if(C=13===p.tag){var x=p.memoizedState;if(null!==x)C=null!==x.dehydrated?!0:!1;else{var w=p.memoizedProps;C=void 0===w.fallback?!1:!0!==w.unstable_avoidThisFallback?!0:A?!1:!0}}if(C){var z=p.updateQueue;if(null===z){var u=new Set;u.add(l);p.updateQueue=u}else z.add(l);if(0===(p.mode&2)){p.flags|=64;h.flags|=16384;h.flags&=-2981;if(1===h.tag)if(null===h.alternate)h.tag=17;else{var t=zg(-1,1);t.tag=2;Ag(h,t)}h.lanes|=1;break a}k=
void 0;h=b;var q=f.pingCache;null===q?(q=f.pingCache=new Oi,k=new Set,q.set(l,k)):(k=q.get(l),void 0===k&&(k=new Set,q.set(l,k)));if(!k.has(h)){k.add(h);var v=Yj.bind(null,f,l,h);l.then(v,v)}p.flags|=4096;p.lanes=b;break a}p=p.return}while(null!==p);k=Error((Ra(h.type)||"A React component")+" suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display.")}5!==V&&(V=2);k=Mi(k,h);p=
g;do{switch(p.tag){case 3:f=k;p.flags|=4096;b&=-b;p.lanes|=b;var J=Pi(p,f,b);Bg(p,J);break a;case 1:f=k;var K=p.type,Q=p.stateNode;if(0===(p.flags&64)&&("function"===typeof K.getDerivedStateFromError||null!==Q&&"function"===typeof Q.componentDidCatch&&(null===Ti||!Ti.has(Q)))){p.flags|=4096;b&=-b;p.lanes|=b;var L=Si(p,f,b);Bg(p,L);break a}}p=p.return}while(null!==p)}Zj(c)}catch(va){b=va;Y===c&&null!==c&&(Y=c=c.return);continue}break}while(1)}
function Pj(){var a=oj.current;oj.current=Gh;return null===a?Gh:a}function Tj(a,b){var c=X;X|=16;var d=Pj();U===a&&W===b||Qj(a,b);do try{ak();break}catch(e){Sj(a,e)}while(1);qg();X=c;oj.current=d;if(null!==Y)throw Error(y(261));U=null;W=0;return V}function ak(){for(;null!==Y;)bk(Y)}function Rj(){for(;null!==Y&&!Qf();)bk(Y)}function bk(a){var b=ck(a.alternate,a,qj);a.memoizedProps=a.pendingProps;null===b?Zj(a):Y=b;pj.current=null}
function Zj(a){var b=a;do{var c=b.alternate;a=b.return;if(0===(b.flags&2048)){c=Gi(c,b,qj);if(null!==c){Y=c;return}c=b;if(24!==c.tag&&23!==c.tag||null===c.memoizedState||0!==(qj&1073741824)||0===(c.mode&4)){for(var d=0,e=c.child;null!==e;)d|=e.lanes|e.childLanes,e=e.sibling;c.childLanes=d}null!==a&&0===(a.flags&2048)&&(null===a.firstEffect&&(a.firstEffect=b.firstEffect),null!==b.lastEffect&&(null!==a.lastEffect&&(a.lastEffect.nextEffect=b.firstEffect),a.lastEffect=b.lastEffect),1<b.flags&&(null!==
a.lastEffect?a.lastEffect.nextEffect=b:a.firstEffect=b,a.lastEffect=b))}else{c=Li(b);if(null!==c){c.flags&=2047;Y=c;return}null!==a&&(a.firstEffect=a.lastEffect=null,a.flags|=2048)}b=b.sibling;if(null!==b){Y=b;return}Y=b=a}while(null!==b);0===V&&(V=5)}function Uj(a){var b=eg();gg(99,dk.bind(null,a,b));return null}
function dk(a,b){do Oj();while(null!==yj);if(0!==(X&48))throw Error(y(327));var c=a.finishedWork;if(null===c)return null;a.finishedWork=null;a.finishedLanes=0;if(c===a.current)throw Error(y(177));a.callbackNode=null;var d=c.lanes|c.childLanes,e=d,f=a.pendingLanes&~e;a.pendingLanes=e;a.suspendedLanes=0;a.pingedLanes=0;a.expiredLanes&=e;a.mutableReadLanes&=e;a.entangledLanes&=e;e=a.entanglements;for(var g=a.eventTimes,h=a.expirationTimes;0<f;){var k=31-Vc(f),l=1<<k;e[k]=0;g[k]=-1;h[k]=-1;f&=~l}null!==
Cj&&0===(d&24)&&Cj.has(a)&&Cj.delete(a);a===U&&(Y=U=null,W=0);1<c.flags?null!==c.lastEffect?(c.lastEffect.nextEffect=c,d=c.firstEffect):d=c:d=c.firstEffect;if(null!==d){e=X;X|=32;pj.current=null;kf=fd;g=Ne();if(Oe(g)){if("selectionStart"in g)h={start:g.selectionStart,end:g.selectionEnd};else a:if(h=(h=g.ownerDocument)&&h.defaultView||window,(l=h.getSelection&&h.getSelection())&&0!==l.rangeCount){h=l.anchorNode;f=l.anchorOffset;k=l.focusNode;l=l.focusOffset;try{h.nodeType,k.nodeType}catch(va){h=null;
break a}var n=0,A=-1,p=-1,C=0,x=0,w=g,z=null;b:for(;;){for(var u;;){w!==h||0!==f&&3!==w.nodeType||(A=n+f);w!==k||0!==l&&3!==w.nodeType||(p=n+l);3===w.nodeType&&(n+=w.nodeValue.length);if(null===(u=w.firstChild))break;z=w;w=u}for(;;){if(w===g)break b;z===h&&++C===f&&(A=n);z===k&&++x===l&&(p=n);if(null!==(u=w.nextSibling))break;w=z;z=w.parentNode}w=u}h=-1===A||-1===p?null:{start:A,end:p}}else h=null;h=h||{start:0,end:0}}else h=null;lf={focusedElem:g,selectionRange:h};fd=!1;Ij=null;Jj=!1;Z=d;do try{ek()}catch(va){if(null===
Z)throw Error(y(330));Wi(Z,va);Z=Z.nextEffect}while(null!==Z);Ij=null;Z=d;do try{for(g=a;null!==Z;){var t=Z.flags;t&16&&pb(Z.stateNode,"");if(t&128){var q=Z.alternate;if(null!==q){var v=q.ref;null!==v&&("function"===typeof v?v(null):v.current=null)}}switch(t&1038){case 2:fj(Z);Z.flags&=-3;break;case 6:fj(Z);Z.flags&=-3;ij(Z.alternate,Z);break;case 1024:Z.flags&=-1025;break;case 1028:Z.flags&=-1025;ij(Z.alternate,Z);break;case 4:ij(Z.alternate,Z);break;case 8:h=Z;cj(g,h);var J=h.alternate;dj(h);null!==
J&&dj(J)}Z=Z.nextEffect}}catch(va){if(null===Z)throw Error(y(330));Wi(Z,va);Z=Z.nextEffect}while(null!==Z);v=lf;q=Ne();t=v.focusedElem;g=v.selectionRange;if(q!==t&&t&&t.ownerDocument&&Me(t.ownerDocument.documentElement,t)){null!==g&&Oe(t)&&(q=g.start,v=g.end,void 0===v&&(v=q),"selectionStart"in t?(t.selectionStart=q,t.selectionEnd=Math.min(v,t.value.length)):(v=(q=t.ownerDocument||document)&&q.defaultView||window,v.getSelection&&(v=v.getSelection(),h=t.textContent.length,J=Math.min(g.start,h),g=void 0===
g.end?J:Math.min(g.end,h),!v.extend&&J>g&&(h=g,g=J,J=h),h=Le(t,J),f=Le(t,g),h&&f&&(1!==v.rangeCount||v.anchorNode!==h.node||v.anchorOffset!==h.offset||v.focusNode!==f.node||v.focusOffset!==f.offset)&&(q=q.createRange(),q.setStart(h.node,h.offset),v.removeAllRanges(),J>g?(v.addRange(q),v.extend(f.node,f.offset)):(q.setEnd(f.node,f.offset),v.addRange(q))))));q=[];for(v=t;v=v.parentNode;)1===v.nodeType&&q.push({element:v,left:v.scrollLeft,top:v.scrollTop});"function"===typeof t.focus&&t.focus();for(t=
0;t<q.length;t++)v=q[t],v.element.scrollLeft=v.left,v.element.scrollTop=v.top}fd=!!kf;lf=kf=null;a.current=c;Z=d;do try{for(t=a;null!==Z;){var K=Z.flags;K&36&&Yi(t,Z.alternate,Z);if(K&128){q=void 0;var Q=Z.ref;if(null!==Q){var L=Z.stateNode;switch(Z.tag){case 5:q=L;break;default:q=L}"function"===typeof Q?Q(q):Q.current=q}}Z=Z.nextEffect}}catch(va){if(null===Z)throw Error(y(330));Wi(Z,va);Z=Z.nextEffect}while(null!==Z);Z=null;$f();X=e}else a.current=c;if(xj)xj=!1,yj=a,zj=b;else for(Z=d;null!==Z;)b=
Z.nextEffect,Z.nextEffect=null,Z.flags&8&&(K=Z,K.sibling=null,K.stateNode=null),Z=b;d=a.pendingLanes;0===d&&(Ti=null);1===d?a===Ej?Dj++:(Dj=0,Ej=a):Dj=0;c=c.stateNode;if(Mf&&"function"===typeof Mf.onCommitFiberRoot)try{Mf.onCommitFiberRoot(Lf,c,void 0,64===(c.current.flags&64))}catch(va){}Mj(a,O());if(Qi)throw Qi=!1,a=Ri,Ri=null,a;if(0!==(X&8))return null;ig();return null}
function ek(){for(;null!==Z;){var a=Z.alternate;Jj||null===Ij||(0!==(Z.flags&8)?dc(Z,Ij)&&(Jj=!0):13===Z.tag&&mj(a,Z)&&dc(Z,Ij)&&(Jj=!0));var b=Z.flags;0!==(b&256)&&Xi(a,Z);0===(b&512)||xj||(xj=!0,hg(97,function(){Oj();return null}));Z=Z.nextEffect}}function Oj(){if(90!==zj){var a=97<zj?97:zj;zj=90;return gg(a,fk)}return!1}function $i(a,b){Aj.push(b,a);xj||(xj=!0,hg(97,function(){Oj();return null}))}function Zi(a,b){Bj.push(b,a);xj||(xj=!0,hg(97,function(){Oj();return null}))}
function fk(){if(null===yj)return!1;var a=yj;yj=null;if(0!==(X&48))throw Error(y(331));var b=X;X|=32;var c=Bj;Bj=[];for(var d=0;d<c.length;d+=2){var e=c[d],f=c[d+1],g=e.destroy;e.destroy=void 0;if("function"===typeof g)try{g()}catch(k){if(null===f)throw Error(y(330));Wi(f,k)}}c=Aj;Aj=[];for(d=0;d<c.length;d+=2){e=c[d];f=c[d+1];try{var h=e.create;e.destroy=h()}catch(k){if(null===f)throw Error(y(330));Wi(f,k)}}for(h=a.current.firstEffect;null!==h;)a=h.nextEffect,h.nextEffect=null,h.flags&8&&(h.sibling=
null,h.stateNode=null),h=a;X=b;ig();return!0}function gk(a,b,c){b=Mi(c,b);b=Pi(a,b,1);Ag(a,b);b=Hg();a=Kj(a,1);null!==a&&($c(a,1,b),Mj(a,b))}
function Wi(a,b){if(3===a.tag)gk(a,a,b);else for(var c=a.return;null!==c;){if(3===c.tag){gk(c,a,b);break}else if(1===c.tag){var d=c.stateNode;if("function"===typeof c.type.getDerivedStateFromError||"function"===typeof d.componentDidCatch&&(null===Ti||!Ti.has(d))){a=Mi(b,a);var e=Si(c,a,1);Ag(c,e);e=Hg();c=Kj(c,1);if(null!==c)$c(c,1,e),Mj(c,e);else if("function"===typeof d.componentDidCatch&&(null===Ti||!Ti.has(d)))try{d.componentDidCatch(b,a)}catch(f){}break}}c=c.return}}
function Yj(a,b,c){var d=a.pingCache;null!==d&&d.delete(b);b=Hg();a.pingedLanes|=a.suspendedLanes&c;U===a&&(W&c)===c&&(4===V||3===V&&(W&62914560)===W&&500>O()-jj?Qj(a,0):uj|=c);Mj(a,b)}function lj(a,b){var c=a.stateNode;null!==c&&c.delete(b);b=0;0===b&&(b=a.mode,0===(b&2)?b=1:0===(b&4)?b=99===eg()?1:2:(0===Gj&&(Gj=tj),b=Yc(62914560&~Gj),0===b&&(b=4194304)));c=Hg();a=Kj(a,b);null!==a&&($c(a,b,c),Mj(a,c))}var ck;
ck=function(a,b,c){var d=b.lanes;if(null!==a)if(a.memoizedProps!==b.pendingProps||N.current)ug=!0;else if(0!==(c&d))ug=0!==(a.flags&16384)?!0:!1;else{ug=!1;switch(b.tag){case 3:ri(b);sh();break;case 5:gh(b);break;case 1:Ff(b.type)&&Jf(b);break;case 4:eh(b,b.stateNode.containerInfo);break;case 10:d=b.memoizedProps.value;var e=b.type._context;I(mg,e._currentValue);e._currentValue=d;break;case 13:if(null!==b.memoizedState){if(0!==(c&b.child.childLanes))return ti(a,b,c);I(P,P.current&1);b=hi(a,b,c);return null!==
b?b.sibling:null}I(P,P.current&1);break;case 19:d=0!==(c&b.childLanes);if(0!==(a.flags&64)){if(d)return Ai(a,b,c);b.flags|=64}e=b.memoizedState;null!==e&&(e.rendering=null,e.tail=null,e.lastEffect=null);I(P,P.current);if(d)break;else return null;case 23:case 24:return b.lanes=0,mi(a,b,c)}return hi(a,b,c)}else ug=!1;b.lanes=0;switch(b.tag){case 2:d=b.type;null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);a=b.pendingProps;e=Ef(b,M.current);tg(b,c);e=Ch(null,b,d,a,e,c);b.flags|=1;if("object"===
typeof e&&null!==e&&"function"===typeof e.render&&void 0===e.$$typeof){b.tag=1;b.memoizedState=null;b.updateQueue=null;if(Ff(d)){var f=!0;Jf(b)}else f=!1;b.memoizedState=null!==e.state&&void 0!==e.state?e.state:null;xg(b);var g=d.getDerivedStateFromProps;"function"===typeof g&&Gg(b,d,g,a);e.updater=Kg;b.stateNode=e;e._reactInternals=b;Og(b,d,a,c);b=qi(null,b,d,!0,f,c)}else b.tag=0,fi(null,b,e,c),b=b.child;return b;case 16:e=b.elementType;a:{null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2);
a=b.pendingProps;f=e._init;e=f(e._payload);b.type=e;f=b.tag=hk(e);a=lg(e,a);switch(f){case 0:b=li(null,b,e,a,c);break a;case 1:b=pi(null,b,e,a,c);break a;case 11:b=gi(null,b,e,a,c);break a;case 14:b=ii(null,b,e,lg(e.type,a),d,c);break a}throw Error(y(306,e,""));}return b;case 0:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),li(a,b,d,e,c);case 1:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),pi(a,b,d,e,c);case 3:ri(b);d=b.updateQueue;if(null===a||null===d)throw Error(y(282));
d=b.pendingProps;e=b.memoizedState;e=null!==e?e.element:null;yg(a,b);Cg(b,d,null,c);d=b.memoizedState.element;if(d===e)sh(),b=hi(a,b,c);else{e=b.stateNode;if(f=e.hydrate)kh=rf(b.stateNode.containerInfo.firstChild),jh=b,f=lh=!0;if(f){a=e.mutableSourceEagerHydrationData;if(null!=a)for(e=0;e<a.length;e+=2)f=a[e],f._workInProgressVersionPrimary=a[e+1],th.push(f);c=Zg(b,null,d,c);for(b.child=c;c;)c.flags=c.flags&-3|1024,c=c.sibling}else fi(a,b,d,c),sh();b=b.child}return b;case 5:return gh(b),null===a&&
ph(b),d=b.type,e=b.pendingProps,f=null!==a?a.memoizedProps:null,g=e.children,nf(d,e)?g=null:null!==f&&nf(d,f)&&(b.flags|=16),oi(a,b),fi(a,b,g,c),b.child;case 6:return null===a&&ph(b),null;case 13:return ti(a,b,c);case 4:return eh(b,b.stateNode.containerInfo),d=b.pendingProps,null===a?b.child=Yg(b,null,d,c):fi(a,b,d,c),b.child;case 11:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),gi(a,b,d,e,c);case 7:return fi(a,b,b.pendingProps,c),b.child;case 8:return fi(a,b,b.pendingProps.children,
c),b.child;case 12:return fi(a,b,b.pendingProps.children,c),b.child;case 10:a:{d=b.type._context;e=b.pendingProps;g=b.memoizedProps;f=e.value;var h=b.type._context;I(mg,h._currentValue);h._currentValue=f;if(null!==g)if(h=g.value,f=He(h,f)?0:("function"===typeof d._calculateChangedBits?d._calculateChangedBits(h,f):1073741823)|0,0===f){if(g.children===e.children&&!N.current){b=hi(a,b,c);break a}}else for(h=b.child,null!==h&&(h.return=b);null!==h;){var k=h.dependencies;if(null!==k){g=h.child;for(var l=
k.firstContext;null!==l;){if(l.context===d&&0!==(l.observedBits&f)){1===h.tag&&(l=zg(-1,c&-c),l.tag=2,Ag(h,l));h.lanes|=c;l=h.alternate;null!==l&&(l.lanes|=c);sg(h.return,c);k.lanes|=c;break}l=l.next}}else g=10===h.tag?h.type===b.type?null:h.child:h.child;if(null!==g)g.return=h;else for(g=h;null!==g;){if(g===b){g=null;break}h=g.sibling;if(null!==h){h.return=g.return;g=h;break}g=g.return}h=g}fi(a,b,e.children,c);b=b.child}return b;case 9:return e=b.type,f=b.pendingProps,d=f.children,tg(b,c),e=vg(e,
f.unstable_observedBits),d=d(e),b.flags|=1,fi(a,b,d,c),b.child;case 14:return e=b.type,f=lg(e,b.pendingProps),f=lg(e.type,f),ii(a,b,e,f,d,c);case 15:return ki(a,b,b.type,b.pendingProps,d,c);case 17:return d=b.type,e=b.pendingProps,e=b.elementType===d?e:lg(d,e),null!==a&&(a.alternate=null,b.alternate=null,b.flags|=2),b.tag=1,Ff(d)?(a=!0,Jf(b)):a=!1,tg(b,c),Mg(b,d,e),Og(b,d,e,c),qi(null,b,d,!0,a,c);case 19:return Ai(a,b,c);case 23:return mi(a,b,c);case 24:return mi(a,b,c)}throw Error(y(156,b.tag));
};function ik(a,b,c,d){this.tag=a;this.key=c;this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null;this.index=0;this.ref=null;this.pendingProps=b;this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null;this.mode=d;this.flags=0;this.lastEffect=this.firstEffect=this.nextEffect=null;this.childLanes=this.lanes=0;this.alternate=null}function nh(a,b,c,d){return new ik(a,b,c,d)}function ji(a){a=a.prototype;return!(!a||!a.isReactComponent)}
function hk(a){if("function"===typeof a)return ji(a)?1:0;if(void 0!==a&&null!==a){a=a.$$typeof;if(a===Aa)return 11;if(a===Da)return 14}return 2}
function Tg(a,b){var c=a.alternate;null===c?(c=nh(a.tag,b,a.key,a.mode),c.elementType=a.elementType,c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.pendingProps=b,c.type=a.type,c.flags=0,c.nextEffect=null,c.firstEffect=null,c.lastEffect=null);c.childLanes=a.childLanes;c.lanes=a.lanes;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;b=a.dependencies;c.dependencies=null===b?null:{lanes:b.lanes,firstContext:b.firstContext};
c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c}
function Vg(a,b,c,d,e,f){var g=2;d=a;if("function"===typeof a)ji(a)&&(g=1);else if("string"===typeof a)g=5;else a:switch(a){case ua:return Xg(c.children,e,f,b);case Ha:g=8;e|=16;break;case wa:g=8;e|=1;break;case xa:return a=nh(12,c,b,e|8),a.elementType=xa,a.type=xa,a.lanes=f,a;case Ba:return a=nh(13,c,b,e),a.type=Ba,a.elementType=Ba,a.lanes=f,a;case Ca:return a=nh(19,c,b,e),a.elementType=Ca,a.lanes=f,a;case Ia:return vi(c,e,f,b);case Ja:return a=nh(24,c,b,e),a.elementType=Ja,a.lanes=f,a;default:if("object"===
typeof a&&null!==a)switch(a.$$typeof){case ya:g=10;break a;case za:g=9;break a;case Aa:g=11;break a;case Da:g=14;break a;case Ea:g=16;d=null;break a;case Fa:g=22;break a}throw Error(y(130,null==a?a:typeof a,""));}b=nh(g,c,b,e);b.elementType=a;b.type=d;b.lanes=f;return b}function Xg(a,b,c,d){a=nh(7,a,d,b);a.lanes=c;return a}function vi(a,b,c,d){a=nh(23,a,d,b);a.elementType=Ia;a.lanes=c;return a}function Ug(a,b,c){a=nh(6,a,null,b);a.lanes=c;return a}
function Wg(a,b,c){b=nh(4,null!==a.children?a.children:[],a.key,b);b.lanes=c;b.stateNode={containerInfo:a.containerInfo,pendingChildren:null,implementation:a.implementation};return b}
function jk(a,b,c){this.tag=b;this.containerInfo=a;this.finishedWork=this.pingCache=this.current=this.pendingChildren=null;this.timeoutHandle=-1;this.pendingContext=this.context=null;this.hydrate=c;this.callbackNode=null;this.callbackPriority=0;this.eventTimes=Zc(0);this.expirationTimes=Zc(-1);this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0;this.entanglements=Zc(0);this.mutableSourceEagerHydrationData=null}
function kk(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:ta,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}}
function lk(a,b,c,d){var e=b.current,f=Hg(),g=Ig(e);a:if(c){c=c._reactInternals;b:{if(Zb(c)!==c||1!==c.tag)throw Error(y(170));var h=c;do{switch(h.tag){case 3:h=h.stateNode.context;break b;case 1:if(Ff(h.type)){h=h.stateNode.__reactInternalMemoizedMergedChildContext;break b}}h=h.return}while(null!==h);throw Error(y(171));}if(1===c.tag){var k=c.type;if(Ff(k)){c=If(c,k,h);break a}}c=h}else c=Cf;null===b.context?b.context=c:b.pendingContext=c;b=zg(f,g);b.payload={element:a};d=void 0===d?null:d;null!==
d&&(b.callback=d);Ag(e,b);Jg(e,g,f);return g}function mk(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case 5:return a.child.stateNode;default:return a.child.stateNode}}function nk(a,b){a=a.memoizedState;if(null!==a&&null!==a.dehydrated){var c=a.retryLane;a.retryLane=0!==c&&c<b?c:b}}function ok(a,b){nk(a,b);(a=a.alternate)&&nk(a,b)}function pk(){return null}
function qk(a,b,c){var d=null!=c&&null!=c.hydrationOptions&&c.hydrationOptions.mutableSources||null;c=new jk(a,b,null!=c&&!0===c.hydrate);b=nh(3,null,null,2===b?7:1===b?3:0);c.current=b;b.stateNode=c;xg(b);a[ff]=c.current;cf(8===a.nodeType?a.parentNode:a);if(d)for(a=0;a<d.length;a++){b=d[a];var e=b._getVersion;e=e(b._source);null==c.mutableSourceEagerHydrationData?c.mutableSourceEagerHydrationData=[b,e]:c.mutableSourceEagerHydrationData.push(b,e)}this._internalRoot=c}
qk.prototype.render=function(a){lk(a,this._internalRoot,null,null)};qk.prototype.unmount=function(){var a=this._internalRoot,b=a.containerInfo;lk(null,a,null,function(){b[ff]=null})};function rk(a){return!(!a||1!==a.nodeType&&9!==a.nodeType&&11!==a.nodeType&&(8!==a.nodeType||" react-mount-point-unstable "!==a.nodeValue))}
function sk(a,b){b||(b=a?9===a.nodeType?a.documentElement:a.firstChild:null,b=!(!b||1!==b.nodeType||!b.hasAttribute("data-reactroot")));if(!b)for(var c;c=a.lastChild;)a.removeChild(c);return new qk(a,0,b?{hydrate:!0}:void 0)}
function tk(a,b,c,d,e){var f=c._reactRootContainer;if(f){var g=f._internalRoot;if("function"===typeof e){var h=e;e=function(){var a=mk(g);h.call(a)}}lk(b,g,a,e)}else{f=c._reactRootContainer=sk(c,d);g=f._internalRoot;if("function"===typeof e){var k=e;e=function(){var a=mk(g);k.call(a)}}Xj(function(){lk(b,g,a,e)})}return mk(g)}ec=function(a){if(13===a.tag){var b=Hg();Jg(a,4,b);ok(a,4)}};fc=function(a){if(13===a.tag){var b=Hg();Jg(a,67108864,b);ok(a,67108864)}};
gc=function(a){if(13===a.tag){var b=Hg(),c=Ig(a);Jg(a,c,b);ok(a,c)}};hc=function(a,b){return b()};
yb=function(a,b,c){switch(b){case "input":ab(a,c);b=c.name;if("radio"===c.type&&null!=b){for(c=a;c.parentNode;)c=c.parentNode;c=c.querySelectorAll("input[name="+JSON.stringify(""+b)+'][type="radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=Db(d);if(!e)throw Error(y(90));Wa(d);ab(d,e)}}}break;case "textarea":ib(a,c);break;case "select":b=c.value,null!=b&&fb(a,!!c.multiple,b,!1)}};Gb=Wj;
Hb=function(a,b,c,d,e){var f=X;X|=4;try{return gg(98,a.bind(null,b,c,d,e))}finally{X=f,0===X&&(wj(),ig())}};Ib=function(){0===(X&49)&&(Vj(),Oj())};Jb=function(a,b){var c=X;X|=2;try{return a(b)}finally{X=c,0===X&&(wj(),ig())}};function uk(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;if(!rk(b))throw Error(y(200));return kk(a,b,null,c)}var vk={Events:[Cb,ue,Db,Eb,Fb,Oj,{current:!1}]},wk={findFiberByHostInstance:wc,bundleType:0,version:"17.0.1",rendererPackageName:"react-dom"};
var xk={bundleType:wk.bundleType,version:wk.version,rendererPackageName:wk.rendererPackageName,rendererConfig:wk.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ra.ReactCurrentDispatcher,findHostInstanceByFiber:function(a){a=cc(a);return null===a?null:a.stateNode},findFiberByHostInstance:wk.findFiberByHostInstance||
pk,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null};if("undefined"!==typeof __REACT_DEVTOOLS_GLOBAL_HOOK__){var yk=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!yk.isDisabled&&yk.supportsFiber)try{Lf=yk.inject(xk),Mf=yk}catch(a){}}exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=vk;exports.createPortal=uk;
exports.findDOMNode=function(a){if(null==a)return null;if(1===a.nodeType)return a;var b=a._reactInternals;if(void 0===b){if("function"===typeof a.render)throw Error(y(188));throw Error(y(268,Object.keys(a)));}a=cc(b);a=null===a?null:a.stateNode;return a};exports.flushSync=function(a,b){var c=X;if(0!==(c&48))return a(b);X|=1;try{if(a)return gg(99,a.bind(null,b))}finally{X=c,ig()}};exports.hydrate=function(a,b,c){if(!rk(b))throw Error(y(200));return tk(null,a,b,!0,c)};
exports.render=function(a,b,c){if(!rk(b))throw Error(y(200));return tk(null,a,b,!1,c)};exports.unmountComponentAtNode=function(a){if(!rk(a))throw Error(y(40));return a._reactRootContainer?(Xj(function(){tk(null,null,a,!1,function(){a._reactRootContainer=null;a[ff]=null})}),!0):!1};exports.unstable_batchedUpdates=Wj;exports.unstable_createPortal=function(a,b){return uk(a,b,2<arguments.length&&void 0!==arguments[2]?arguments[2]:null)};
exports.unstable_renderSubtreeIntoContainer=function(a,b,c,d){if(!rk(c))throw Error(y(200));if(null==a||void 0===a._reactInternals)throw Error(y(38));return tk(a,b,c,!1,d)};exports.version="17.0.1";


/***/ }),

/***/ 935:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


function checkDCE() {
  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
  if (
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
  ) {
    return;
  }
  if (false) {}
  try {
    // Verify that the code above has been dead code eliminated (DCE'd).
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    // DevTools shouldn't crash React, no matter what.
    // We should still report in case we break this code.
    console.error(err);
  }
}

if (true) {
  // DCE check should happen before ReactDOM bundle executes so that
  // DevTools can report bad minification during injection.
  checkDCE();
  module.exports = __webpack_require__(448);
} else {}


/***/ }),

/***/ 86:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}__webpack_unused_export__=l;__webpack_unused_export__=m;__webpack_unused_export__=k;__webpack_unused_export__=h;__webpack_unused_export__=c;__webpack_unused_export__=n;__webpack_unused_export__=e;__webpack_unused_export__=t;__webpack_unused_export__=r;__webpack_unused_export__=d;
__webpack_unused_export__=g;__webpack_unused_export__=f;__webpack_unused_export__=p;__webpack_unused_export__=function(a){return A(a)||z(a)===l};__webpack_unused_export__=A;__webpack_unused_export__=function(a){return z(a)===k};__webpack_unused_export__=function(a){return z(a)===h};__webpack_unused_export__=function(a){return"object"===typeof a&&null!==a&&a.$$typeof===c};__webpack_unused_export__=function(a){return z(a)===n};__webpack_unused_export__=function(a){return z(a)===e};__webpack_unused_export__=function(a){return z(a)===t};
__webpack_unused_export__=function(a){return z(a)===r};__webpack_unused_export__=function(a){return z(a)===d};__webpack_unused_export__=function(a){return z(a)===g};__webpack_unused_export__=function(a){return z(a)===f};__webpack_unused_export__=function(a){return z(a)===p};
__webpack_unused_export__=function(a){return"string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};__webpack_unused_export__=z;


/***/ }),

/***/ 663:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (true) {
  /* unused reexport */ __webpack_require__(86);
} else {}


/***/ }),

/***/ 231:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;
__webpack_unused_export__ = ({value:!0});var t=__webpack_require__(294);function i(){return(i=Object.assign||function(t){for(var i=1;i<arguments.length;i++){var s=arguments[i];for(var n in s)Object.prototype.hasOwnProperty.call(s,n)&&(t[n]=s[n])}return t}).apply(this,arguments)}var s=t.createElement("svg",{viewBox:"-2 -5 14 20",height:"100%",width:"100%",style:{position:"absolute",top:0}},t.createElement("path",{d:"M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12",fill:"#fff",fillRule:"evenodd"})),n=t.createElement("svg",{height:"100%",width:"100%",viewBox:"-2 -5 17 21",style:{position:"absolute",top:0}},t.createElement("path",{d:"M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0",fill:"#fff",fillRule:"evenodd"}));function o(t){if(7===t.length)return t;for(var i="#",s=1;s<4;s+=1)i+=t[s]+t[s];return i}function h(t,i,s,n,h){return function(t,i,s,n,o){var h=(t-s)/(i-s);if(0===h)return n;if(1===h)return o;for(var e="#",a=1;a<6;a+=2){var r=parseInt(n.substr(a,2),16),l=parseInt(o.substr(a,2),16),u=Math.round((1-h)*r+h*l).toString(16);1===u.length&&(u="0"+u),e+=u}return e}(t,i,s,o(n),o(h))}var e=function(s){function n(t){s.call(this,t);var i=t.height,n=t.width,o=t.checked;this.t=t.handleDiameter||i-2,this.i=Math.max(n-i,n-(i+this.t)/2),this.o=Math.max(0,(i-this.t)/2),this.state={h:o?this.i:this.o},this.l=0,this.u=0,this.p=this.p.bind(this),this.v=this.v.bind(this),this.g=this.g.bind(this),this.k=this.k.bind(this),this.M=this.M.bind(this),this.m=this.m.bind(this),this.T=this.T.bind(this),this.$=this.$.bind(this),this.C=this.C.bind(this),this.D=this.D.bind(this),this.O=this.O.bind(this),this.S=this.S.bind(this)}return s&&(n.__proto__=s),(n.prototype=Object.create(s&&s.prototype)).constructor=n,n.prototype.componentDidMount=function(){this.W=!0},n.prototype.componentDidUpdate=function(t){t.checked!==this.props.checked&&this.setState({h:this.props.checked?this.i:this.o})},n.prototype.componentWillUnmount=function(){this.W=!1},n.prototype.I=function(t){this.H.focus(),this.setState({R:t,j:!0,B:Date.now()})},n.prototype.L=function(t){var i=this.state,s=i.R,n=i.h,o=(this.props.checked?this.i:this.o)+t-s;i.N||t===s||this.setState({N:!0});var h=Math.min(this.i,Math.max(this.o,o));h!==n&&this.setState({h:h})},n.prototype.U=function(t){var i=this.state,s=i.h,n=i.N,o=i.B,h=this.props.checked,e=(this.i+this.o)/2;this.setState({h:this.props.checked?this.i:this.o});var a=Date.now()-o;(!n||a<250||(h&&s<=e||!h&&s>=e))&&this.A(t),this.W&&this.setState({N:!1,j:!1}),this.l=Date.now()},n.prototype.p=function(t){t.preventDefault(),"number"==typeof t.button&&0!==t.button||(this.I(t.clientX),window.addEventListener("mousemove",this.v),window.addEventListener("mouseup",this.g))},n.prototype.v=function(t){t.preventDefault(),this.L(t.clientX)},n.prototype.g=function(t){this.U(t),window.removeEventListener("mousemove",this.v),window.removeEventListener("mouseup",this.g)},n.prototype.k=function(t){this.X=null,this.I(t.touches[0].clientX)},n.prototype.M=function(t){this.L(t.touches[0].clientX)},n.prototype.m=function(t){t.preventDefault(),this.U(t)},n.prototype.$=function(t){Date.now()-this.l>50&&(this.A(t),Date.now()-this.u>50&&this.W&&this.setState({j:!1}))},n.prototype.C=function(){this.u=Date.now()},n.prototype.D=function(){this.setState({j:!0})},n.prototype.O=function(){this.setState({j:!1})},n.prototype.S=function(t){this.H=t},n.prototype.T=function(t){t.preventDefault(),this.H.focus(),this.A(t),this.W&&this.setState({j:!1})},n.prototype.A=function(t){var i=this.props;(0,i.onChange)(!i.checked,t,i.id)},n.prototype.render=function(){var s=this.props,n=s.checked,o=s.disabled,e=s.className,a=s.offColor,r=s.onColor,l=s.offHandleColor,u=s.onHandleColor,c=s.checkedIcon,d=s.uncheckedIcon,f=s.checkedHandleIcon,p=s.uncheckedHandleIcon,b=s.boxShadow,v=s.activeBoxShadow,g=s.height,y=s.width,w=s.borderRadius,k=function(t,i){var s={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&-1===i.indexOf(n)&&(s[n]=t[n]);return s}(s,["checked","disabled","className","offColor","onColor","offHandleColor","onHandleColor","checkedIcon","uncheckedIcon","checkedHandleIcon","uncheckedHandleIcon","boxShadow","activeBoxShadow","height","width","borderRadius","handleDiameter"]),M=this.state,m=M.h,T=M.N,x=M.j,$={position:"relative",display:"inline-block",textAlign:"left",opacity:o?.5:1,direction:"ltr",borderRadius:g/2,WebkitTransition:"opacity 0.25s",MozTransition:"opacity 0.25s",transition:"opacity 0.25s",touchAction:"none",WebkitTapHighlightColor:"rgba(0, 0, 0, 0)",WebkitUserSelect:"none",MozUserSelect:"none",msUserSelect:"none",userSelect:"none"},C={height:g,width:y,margin:Math.max(0,(this.t-g)/2),position:"relative",background:h(m,this.i,this.o,a,r),borderRadius:"number"==typeof w?w:g/2,cursor:o?"default":"pointer",WebkitTransition:T?null:"background 0.25s",MozTransition:T?null:"background 0.25s",transition:T?null:"background 0.25s"},D={height:g,width:Math.min(1.5*g,y-(this.t+g)/2+1),position:"relative",opacity:(m-this.o)/(this.i-this.o),pointerEvents:"none",WebkitTransition:T?null:"opacity 0.25s",MozTransition:T?null:"opacity 0.25s",transition:T?null:"opacity 0.25s"},O={height:g,width:Math.min(1.5*g,y-(this.t+g)/2+1),position:"absolute",opacity:1-(m-this.o)/(this.i-this.o),right:0,top:0,pointerEvents:"none",WebkitTransition:T?null:"opacity 0.25s",MozTransition:T?null:"opacity 0.25s",transition:T?null:"opacity 0.25s"},S={height:this.t,width:this.t,background:h(m,this.i,this.o,l,u),display:"inline-block",cursor:o?"default":"pointer",borderRadius:"number"==typeof w?w-1:"50%",position:"absolute",transform:"translateX("+m+"px)",top:Math.max(0,(g-this.t)/2),outline:0,boxShadow:x?v:b,border:0,WebkitTransition:T?null:"background-color 0.25s, transform 0.25s, box-shadow 0.15s",MozTransition:T?null:"background-color 0.25s, transform 0.25s, box-shadow 0.15s",transition:T?null:"background-color 0.25s, transform 0.25s, box-shadow 0.15s"},W={height:this.t,width:this.t,opacity:Math.max(2*(1-(m-this.o)/(this.i-this.o)-.5),0),position:"absolute",left:0,top:0,pointerEvents:"none",WebkitTransition:T?null:"opacity 0.25s",MozTransition:T?null:"opacity 0.25s",transition:T?null:"opacity 0.25s"},z={height:this.t,width:this.t,opacity:Math.max(2*((m-this.o)/(this.i-this.o)-.5),0),position:"absolute",left:0,top:0,pointerEvents:"none",WebkitTransition:T?null:"opacity 0.25s",MozTransition:T?null:"opacity 0.25s",transition:T?null:"opacity 0.25s"};return t.createElement("div",{className:e,style:$},t.createElement("div",{className:"react-switch-bg",style:C,onClick:o?null:this.T,onMouseDown:function(t){return t.preventDefault()}},c&&t.createElement("div",{style:D},c),d&&t.createElement("div",{style:O},d)),t.createElement("div",{className:"react-switch-handle",style:S,onClick:function(t){return t.preventDefault()},onMouseDown:o?null:this.p,onTouchStart:o?null:this.k,onTouchMove:o?null:this.M,onTouchEnd:o?null:this.m,onTouchCancel:o?null:this.O},p&&t.createElement("div",{style:W},p),f&&t.createElement("div",{style:z},f)),t.createElement("input",i({},{type:"checkbox",role:"switch","aria-checked":n,checked:n,disabled:o,style:{border:0,clip:"rect(0 0 0 0)",height:1,margin:-1,overflow:"hidden",padding:0,position:"absolute",width:1}},k,{ref:this.S,onFocus:this.D,onBlur:this.O,onKeyUp:this.C,onChange:this.$})))},n}(t.Component);e.defaultProps={disabled:!1,offColor:"#888",onColor:"#080",offHandleColor:"#fff",onHandleColor:"#fff",uncheckedIcon:s,checkedIcon:n,boxShadow:null,activeBoxShadow:"0 0 2px 3px #3bf",height:28,width:56},exports.default=e;


/***/ }),

/***/ 936:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

if (true) {
  module.exports = __webpack_require__(231);
} else {}


/***/ }),

/***/ 408:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/** @license React v17.0.1
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l=__webpack_require__(418),n=60103,p=60106;exports.Fragment=60107;exports.StrictMode=60108;exports.Profiler=60114;var q=60109,r=60110,t=60112;exports.Suspense=60113;var u=60115,v=60116;
if("function"===typeof Symbol&&Symbol.for){var w=Symbol.for;n=w("react.element");p=w("react.portal");exports.Fragment=w("react.fragment");exports.StrictMode=w("react.strict_mode");exports.Profiler=w("react.profiler");q=w("react.provider");r=w("react.context");t=w("react.forward_ref");exports.Suspense=w("react.suspense");u=w("react.memo");v=w("react.lazy")}var x="function"===typeof Symbol&&Symbol.iterator;
function y(a){if(null===a||"object"!==typeof a)return null;a=x&&a[x]||a["@@iterator"];return"function"===typeof a?a:null}function z(a){for(var b="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=1;c<arguments.length;c++)b+="&args[]="+encodeURIComponent(arguments[c]);return"Minified React error #"+a+"; visit "+b+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}
var A={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},B={};function C(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A}C.prototype.isReactComponent={};C.prototype.setState=function(a,b){if("object"!==typeof a&&"function"!==typeof a&&null!=a)throw Error(z(85));this.updater.enqueueSetState(this,a,b,"setState")};C.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};
function D(){}D.prototype=C.prototype;function E(a,b,c){this.props=a;this.context=b;this.refs=B;this.updater=c||A}var F=E.prototype=new D;F.constructor=E;l(F,C.prototype);F.isPureReactComponent=!0;var G={current:null},H=Object.prototype.hasOwnProperty,I={key:!0,ref:!0,__self:!0,__source:!0};
function J(a,b,c){var e,d={},k=null,h=null;if(null!=b)for(e in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(k=""+b.key),b)H.call(b,e)&&!I.hasOwnProperty(e)&&(d[e]=b[e]);var g=arguments.length-2;if(1===g)d.children=c;else if(1<g){for(var f=Array(g),m=0;m<g;m++)f[m]=arguments[m+2];d.children=f}if(a&&a.defaultProps)for(e in g=a.defaultProps,g)void 0===d[e]&&(d[e]=g[e]);return{$$typeof:n,type:a,key:k,ref:h,props:d,_owner:G.current}}
function K(a,b){return{$$typeof:n,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function L(a){return"object"===typeof a&&null!==a&&a.$$typeof===n}function escape(a){var b={"=":"=0",":":"=2"};return"$"+a.replace(/[=:]/g,function(a){return b[a]})}var M=/\/+/g;function N(a,b){return"object"===typeof a&&null!==a&&null!=a.key?escape(""+a.key):b.toString(36)}
function O(a,b,c,e,d){var k=typeof a;if("undefined"===k||"boolean"===k)a=null;var h=!1;if(null===a)h=!0;else switch(k){case "string":case "number":h=!0;break;case "object":switch(a.$$typeof){case n:case p:h=!0}}if(h)return h=a,d=d(h),a=""===e?"."+N(h,0):e,Array.isArray(d)?(c="",null!=a&&(c=a.replace(M,"$&/")+"/"),O(d,b,c,"",function(a){return a})):null!=d&&(L(d)&&(d=K(d,c+(!d.key||h&&h.key===d.key?"":(""+d.key).replace(M,"$&/")+"/")+a)),b.push(d)),1;h=0;e=""===e?".":e+":";if(Array.isArray(a))for(var g=
0;g<a.length;g++){k=a[g];var f=e+N(k,g);h+=O(k,b,c,f,d)}else if(f=y(a),"function"===typeof f)for(a=f.call(a),g=0;!(k=a.next()).done;)k=k.value,f=e+N(k,g++),h+=O(k,b,c,f,d);else if("object"===k)throw b=""+a,Error(z(31,"[object Object]"===b?"object with keys {"+Object.keys(a).join(", ")+"}":b));return h}function P(a,b,c){if(null==a)return a;var e=[],d=0;O(a,e,"","",function(a){return b.call(c,a,d++)});return e}
function Q(a){if(-1===a._status){var b=a._result;b=b();a._status=0;a._result=b;b.then(function(b){0===a._status&&(b=b.default,a._status=1,a._result=b)},function(b){0===a._status&&(a._status=2,a._result=b)})}if(1===a._status)return a._result;throw a._result;}var R={current:null};function S(){var a=R.current;if(null===a)throw Error(z(321));return a}var T={ReactCurrentDispatcher:R,ReactCurrentBatchConfig:{transition:0},ReactCurrentOwner:G,IsSomeRendererActing:{current:!1},assign:l};
exports.Children={map:P,forEach:function(a,b,c){P(a,function(){b.apply(this,arguments)},c)},count:function(a){var b=0;P(a,function(){b++});return b},toArray:function(a){return P(a,function(a){return a})||[]},only:function(a){if(!L(a))throw Error(z(143));return a}};exports.Component=C;exports.PureComponent=E;exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=T;
exports.cloneElement=function(a,b,c){if(null===a||void 0===a)throw Error(z(267,a));var e=l({},a.props),d=a.key,k=a.ref,h=a._owner;if(null!=b){void 0!==b.ref&&(k=b.ref,h=G.current);void 0!==b.key&&(d=""+b.key);if(a.type&&a.type.defaultProps)var g=a.type.defaultProps;for(f in b)H.call(b,f)&&!I.hasOwnProperty(f)&&(e[f]=void 0===b[f]&&void 0!==g?g[f]:b[f])}var f=arguments.length-2;if(1===f)e.children=c;else if(1<f){g=Array(f);for(var m=0;m<f;m++)g[m]=arguments[m+2];e.children=g}return{$$typeof:n,type:a.type,
key:d,ref:k,props:e,_owner:h}};exports.createContext=function(a,b){void 0===b&&(b=null);a={$$typeof:r,_calculateChangedBits:b,_currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null};a.Provider={$$typeof:q,_context:a};return a.Consumer=a};exports.createElement=J;exports.createFactory=function(a){var b=J.bind(null,a);b.type=a;return b};exports.createRef=function(){return{current:null}};exports.forwardRef=function(a){return{$$typeof:t,render:a}};exports.isValidElement=L;
exports.lazy=function(a){return{$$typeof:v,_payload:{_status:-1,_result:a},_init:Q}};exports.memo=function(a,b){return{$$typeof:u,type:a,compare:void 0===b?null:b}};exports.useCallback=function(a,b){return S().useCallback(a,b)};exports.useContext=function(a,b){return S().useContext(a,b)};exports.useDebugValue=function(){};exports.useEffect=function(a,b){return S().useEffect(a,b)};exports.useImperativeHandle=function(a,b,c){return S().useImperativeHandle(a,b,c)};
exports.useLayoutEffect=function(a,b){return S().useLayoutEffect(a,b)};exports.useMemo=function(a,b){return S().useMemo(a,b)};exports.useReducer=function(a,b,c){return S().useReducer(a,b,c)};exports.useRef=function(a){return S().useRef(a)};exports.useState=function(a){return S().useState(a)};exports.version="17.0.1";


/***/ }),

/***/ 294:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (true) {
  module.exports = __webpack_require__(408);
} else {}


/***/ }),

/***/ 53:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/** @license React v0.20.1
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f,g,h,k;if("object"===typeof performance&&"function"===typeof performance.now){var l=performance;exports.unstable_now=function(){return l.now()}}else{var p=Date,q=p.now();exports.unstable_now=function(){return p.now()-q}}
if("undefined"===typeof window||"function"!==typeof MessageChannel){var t=null,u=null,w=function(){if(null!==t)try{var a=exports.unstable_now();t(!0,a);t=null}catch(b){throw setTimeout(w,0),b;}};f=function(a){null!==t?setTimeout(f,0,a):(t=a,setTimeout(w,0))};g=function(a,b){u=setTimeout(a,b)};h=function(){clearTimeout(u)};exports.unstable_shouldYield=function(){return!1};k=exports.unstable_forceFrameRate=function(){}}else{var x=window.setTimeout,y=window.clearTimeout;if("undefined"!==typeof console){var z=
window.cancelAnimationFrame;"function"!==typeof window.requestAnimationFrame&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills");"function"!==typeof z&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills")}var A=!1,B=null,C=-1,D=5,E=0;exports.unstable_shouldYield=function(){return exports.unstable_now()>=
E};k=function(){};exports.unstable_forceFrameRate=function(a){0>a||125<a?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):D=0<a?Math.floor(1E3/a):5};var F=new MessageChannel,G=F.port2;F.port1.onmessage=function(){if(null!==B){var a=exports.unstable_now();E=a+D;try{B(!0,a)?G.postMessage(null):(A=!1,B=null)}catch(b){throw G.postMessage(null),b;}}else A=!1};f=function(a){B=a;A||(A=!0,G.postMessage(null))};g=function(a,b){C=
x(function(){a(exports.unstable_now())},b)};h=function(){y(C);C=-1}}function H(a,b){var c=a.length;a.push(b);a:for(;;){var d=c-1>>>1,e=a[d];if(void 0!==e&&0<I(e,b))a[d]=b,a[c]=e,c=d;else break a}}function J(a){a=a[0];return void 0===a?null:a}
function K(a){var b=a[0];if(void 0!==b){var c=a.pop();if(c!==b){a[0]=c;a:for(var d=0,e=a.length;d<e;){var m=2*(d+1)-1,n=a[m],v=m+1,r=a[v];if(void 0!==n&&0>I(n,c))void 0!==r&&0>I(r,n)?(a[d]=r,a[v]=c,d=v):(a[d]=n,a[m]=c,d=m);else if(void 0!==r&&0>I(r,c))a[d]=r,a[v]=c,d=v;else break a}}return b}return null}function I(a,b){var c=a.sortIndex-b.sortIndex;return 0!==c?c:a.id-b.id}var L=[],M=[],N=1,O=null,P=3,Q=!1,R=!1,S=!1;
function T(a){for(var b=J(M);null!==b;){if(null===b.callback)K(M);else if(b.startTime<=a)K(M),b.sortIndex=b.expirationTime,H(L,b);else break;b=J(M)}}function U(a){S=!1;T(a);if(!R)if(null!==J(L))R=!0,f(V);else{var b=J(M);null!==b&&g(U,b.startTime-a)}}
function V(a,b){R=!1;S&&(S=!1,h());Q=!0;var c=P;try{T(b);for(O=J(L);null!==O&&(!(O.expirationTime>b)||a&&!exports.unstable_shouldYield());){var d=O.callback;if("function"===typeof d){O.callback=null;P=O.priorityLevel;var e=d(O.expirationTime<=b);b=exports.unstable_now();"function"===typeof e?O.callback=e:O===J(L)&&K(L);T(b)}else K(L);O=J(L)}if(null!==O)var m=!0;else{var n=J(M);null!==n&&g(U,n.startTime-b);m=!1}return m}finally{O=null,P=c,Q=!1}}var W=k;exports.unstable_IdlePriority=5;
exports.unstable_ImmediatePriority=1;exports.unstable_LowPriority=4;exports.unstable_NormalPriority=3;exports.unstable_Profiling=null;exports.unstable_UserBlockingPriority=2;exports.unstable_cancelCallback=function(a){a.callback=null};exports.unstable_continueExecution=function(){R||Q||(R=!0,f(V))};exports.unstable_getCurrentPriorityLevel=function(){return P};exports.unstable_getFirstCallbackNode=function(){return J(L)};
exports.unstable_next=function(a){switch(P){case 1:case 2:case 3:var b=3;break;default:b=P}var c=P;P=b;try{return a()}finally{P=c}};exports.unstable_pauseExecution=function(){};exports.unstable_requestPaint=W;exports.unstable_runWithPriority=function(a,b){switch(a){case 1:case 2:case 3:case 4:case 5:break;default:a=3}var c=P;P=a;try{return b()}finally{P=c}};
exports.unstable_scheduleCallback=function(a,b,c){var d=exports.unstable_now();"object"===typeof c&&null!==c?(c=c.delay,c="number"===typeof c&&0<c?d+c:d):c=d;switch(a){case 1:var e=-1;break;case 2:e=250;break;case 5:e=1073741823;break;case 4:e=1E4;break;default:e=5E3}e=c+e;a={id:N++,callback:b,priorityLevel:a,startTime:c,expirationTime:e,sortIndex:-1};c>d?(a.sortIndex=c,H(M,a),null===J(L)&&a===J(M)&&(S?h():S=!0,g(U,c-d))):(a.sortIndex=e,H(L,a),R||Q||(R=!0,f(V)));return a};
exports.unstable_wrapCallback=function(a){var b=P;return function(){var c=P;P=b;try{return a.apply(this,arguments)}finally{P=c}}};


/***/ }),

/***/ 840:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (true) {
  module.exports = __webpack_require__(53);
} else {}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__(149);
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=managementBundle.js.map