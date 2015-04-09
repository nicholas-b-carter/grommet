// (C) Copyright 2014-2015 Hewlett-Packard Development Company, L.P.

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Ligo = require('ligo');
var TBD = Ligo.TBD;
var HelloWorld = require('./HelloWorld');
var hljs = require('highlight.js');

var CONTENTS = [
  {label: 'Guides',
    contents: [
      {route: 'doc_helloworld', label: 'Hello World', component: HelloWorld, default: true},
      {route: 'doc_getstarted', label: 'Get Started', component: TBD}
    ]
  },
  {label: 'Patterns',
    contents: [
      {route: 'doc_dashboard', label: 'Dashboard', component: TBD},
      {route: 'doc_index', label: 'Index', component: TBD},
      {route: 'doc_login', label: 'Login', component: TBD},
      {route: 'doc_navigation', label: 'Navigation', component: TBD},
      {route: 'doc_search', label: 'Search', component: TBD},
      {route: 'doc_session', label: 'Session', component: TBD}
    ]
  },
  {label: 'Components',
    contents: [
      {route: 'doc_chart', label: 'Chart', component: TBD},
      {route: 'doc_document', label: 'Document', component: TBD},
      {route: 'doc_donut', label: 'Donut', component: TBD},
      {route: 'doc_footer', label: 'Footer', component: TBD},
      {route: 'doc_form', label: 'Form', component: TBD},
      {route: 'doc_header', label: 'Header', component: TBD},
      {route: 'doc_menu', label: 'Menu', component: TBD},
      {route: 'doc_meter', label: 'Meter', component: TBD},
      {route: 'doc_table', label: 'Table', component: TBD},
      {route: 'doc_tile', label: 'Tile', component: TBD}
    ]
  },
  {label: 'Reference',
    contents: [
      {route: 'doc_architecture', label: 'Architecture', component: TBD}
    ]
  }
];

function createPageLinks(contents, level) {
  var result = [];
  contents.forEach(function (page) {
    if (page.hasOwnProperty('route')) {
      result.push(<Link key={page.label} to={page.route}>{page.label}</Link>);
    } else {
      if (2 === level) {
        result.push(<h3 key={page.label}>{page.label}</h3>);
      } else if (3 === level) {
        result.push(<h4 key={page.label}>{page.label}</h4>);
      } else {
        result.push(<h5 key={page.label}>{page.label}</h5>);
      }
    }
    if (page.hasOwnProperty('contents')) {
      result = result.concat(createPageLinks(page.contents, level + 1));
    }
  });
  return result;
}

var Documentation = React.createClass({

  componentDidMount: function () {
    this.highlightCode();
  },

  componentDidUpdate: function () {
    this.highlightCode();
  },

  highlightCode: function () {
    var domNode = this.getDOMNode();
    var nodes = domNode.querySelectorAll('pre code');
    if (nodes.length > 0) {
      for (var i = 0; i < nodes.length; i++) {
        hljs.highlightBlock(nodes[i]);
      }
    }
  },

  render: function() {
    var pages = createPageLinks(CONTENTS, 2);
    return (
      <Ligo.Layout centerColumn={true}>
        <Ligo.Nav vertical={true} accentIndex={1}>{pages}</Ligo.Nav>
        <Ligo.Document accentIndex={1}>
          <RouteHandler />
        </Ligo.Document>
      </Ligo.Layout>
    );
  }
});

function createContentRoutes(contents) {
  var result = [];
  contents.forEach(function (content) {
    if (content.default) {
      result.push(
        <DefaultRoute key={content.label} name={content.route}
          handler={content.component} />
      );
    } else {
      result.push(
        <Route key={content.label} name={content.route}
          path={content.label.toLowerCase().replace(/ /g,"-")}
          handler={content.component} />
      );
    }
    if (content.hasOwnProperty('contents')) {
      result = result.concat(createContentRoutes(content.contents));
    }
  });
  return result;
}

Documentation.routes = function () {
  var routes = createContentRoutes(CONTENTS);
  return (
    <Route name="documentation" path="documentation" handler={Documentation}>
      {routes}
    </Route>
  );
};

module.exports = Documentation;
