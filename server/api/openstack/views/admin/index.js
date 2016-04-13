'use strict';

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const glob = require('glob');
const adminModel = require('client/applications/admin/model.jsx');
const adminModelFactory = React.createFactory(adminModel);
const upperCaseLocale = require('helpers/upper_case_locale');
const config = require('config');

const websocketUrl = config('websocket').url;
const regions = {};
const languages = Object.keys(config('region')[0].name);
languages.forEach((lang) => {
  regions[lang] = [];
  config('region').forEach((reg) => {
    regions[lang].push({
      name: reg.name[lang],
      id: reg.id
    });
  });
});

const files = glob.sync('*', {
  cwd: 'client/dist/'
});
const uskinFile = glob.sync('*.uskin.min.css', {
  cwd: 'client/dist/uskin'
});
const locales = JSON.parse(JSON.stringify(global.locales.availableLocales)).map(upperCaseLocale);
const staticFiles = {};
locales.forEach((locale) => {
  staticFiles[locale] = {};
  let regex = new RegExp(locale + '.admin.min.js$');
  files.some((file) => {
    return file.match(regex) && (staticFiles[locale].adminJsFile = file);
  });
});
staticFiles.adminCssFile = files.find((el) => {
  return el.match(/admin.min.css$/) !== null;
});

let applications;

function renderTemplate (req, res, next) {
  if (req.session && req.session.user) {
    let locale = upperCaseLocale(req.i18n.getLocale());
    let __ = req.i18n.__.bind(req.i18n);
    let user = req.session.user;
    let username = user.username;
    let _applications = applications.filter(a => {
      return a !== 'login';
    }).map(_app => {
      return __('shared.${_app}.application_name');
    });
    let HALO = {
      configs: {
        lang: locale
      },
      user: {
        projectId: user.projectId,
        projects: user.projects,
        userId: user.userId,
        username: username,
        isAdmin: true
      },
      region_list: regions[locale],
      current_region: user.regionId ? user.regionId : regions[locale][0].id,
      // FIXME:
      websocket: {
        url: websocketUrl
      },
      'applications': _applications
    };
    res.render('admin', {
      HALO: JSON.stringify(HALO),
      mainJsFile: staticFiles[locale].adminJsFile,
      mainCssFile: staticFiles.adminCssFile,
      uskinFile: uskinFile[0],
      modelTmpl: ReactDOMServer.renderToString(adminModelFactory({
        __: __('shared.admin'),
        HALO: HALO
      }))
    });
  } else if (req.session && req.session.user){
    res.redirect('/project');
  } else {
    res.redirect('/');
  }
}

module.exports = (app) => {
  let views = app.get('views');
  views.push(__dirname);
  applications = app.get('applications');
  app.get(/admin(|\/(.*))/, renderTemplate);
};