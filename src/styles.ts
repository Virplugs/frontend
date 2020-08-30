import lessToJs from 'less-vars-to-js';
import varsLess from '!!raw-loader!@/styles/vars.less';

export const palette = lessToJs(varsLess, { resolveVariables: true, stripPrefix: true });
