const path = require('path');
const fs = require('fs-extra');

const { setArgValue, getCLIPath, getConfig } = require('../../global-store');

const { addFile, appendFileWithTemplate, appendFileWithText, modifyFileWithText } = require('./utils');
module.exports = plop => {
  plop.setHelper('jsx-bracket', (txt) => `{${txt}}`);

  plop.setGenerator("redux-saga-files", {
    description: "Generate redux-saga files",
    prompts: [],
    actions: (answers) => {
      const { containerName } = answers;

      setArgValue({containerName});

      let actions = [
        addFile('action'),

        addFile('saga'),
        addFile('sagas-index', 'index'),
        appendFileWithText(
          'sagas-index', 
          /(\/\/EXPORTED_SAGAS)/gi,
          "{{camelCase entityName}}: {{camelCase entityName}}Saga,",
          'index'
        ),
        appendFileWithText(
          'sagas-index', 
          /(\/\/IMPORTED_SAGAS)/gi,
          `import {{camelCase entityName}}Saga from './{{camelCase entityName}}Saga';`,
          'index'
        ),
        
        addFile('reducer'),
        addFile('reducers-index', 'index'),
        appendFileWithText(
          'reducers-index', 
          /(\/\/EXPORTED_REDUCERS)/gi,
          "{{camelCase entityName}}: {{camelCase entityName}}Reducer,",
          'index'
        ),
        appendFileWithText(
          'reducers-index', 
          /(\/\/IMPORTED_REDUCERS)/gi,
          `import {{camelCase entityName}}Reducer from './{{camelCase entityName}}Reducer';`,
          'index'
        ),
        
        addFile('entity-component', '{{pascalCase entityName}}'),
        addFile('entity-components-index', 'index'),
        appendFileWithText(
          'entity-components-index', 
          /(\/\/EXPORTED_COMPONENTS)/gi,
          "export const {{pascalCase entityName}} = {{pascalCase entityName}}Entity;",
          'index'
        ),
        appendFileWithText(
          'entity-components-index', 
          /(\/\/IMPORTED_COMPONENTS)/gi,
          `import {{pascalCase entityName}}Entity from './{{pascalCase entityName}}';`,
          'index'
        )
      ]

      if (containerName) {
        actions = [...actions,
          addFile('container-component', 'index'),
          appendFileWithText(
            'container-component', 
            /({\/\*DEFINED_ENTITY_COMPONENT_HERE\*\/})/gi,
            '<{{pascalCase entityName}} />',
            'index'
          ),
          appendFileWithText(
            'container-component', 
            /(\/\/DEFINED_ENTITY_NAME_HERE)/gi,
            '{{pascalCase entityName}},',
            'index'
          ),
          appendFileWithTemplate(
            'container-component', 
            /(\/\/DEFINED_ENTITY_ACTION_METHODS)/gi,
            'entity-actions-import',
            'index'
          ),
          appendFileWithTemplate(
            'container-component', 
            /(\/\/DEFINED_ENTITY_ACTIONS_PROPTYPES)/gi,
            'entity-actions-proptypes',
            'index'
          ),
          appendFileWithTemplate(
            'container-component', 
            /(\/\/DEFINED_ENTITY_DISPATCH_PROPS)/gi,
            'entity-actions-dispatch-props',
            'index'
          ),
          modifyFileWithText(
            'container-component', 
            /(<parentheses-right>)/gi,
            ')',
            'index'
          ),
          modifyFileWithText(
            'container-component', 
            /(<parentheses-left>)/gi,
            '(',
            'index'
          ),
        ]
      }
      return actions
    }
  });
};
