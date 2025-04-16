const _ = require('lodash');

const {
    darkBlack
}  = require('material-ui/styles/colors');

const {fade}  = require('material-ui/utils/colorManipulator');

const lightBaseTheme = require('material-ui/styles/baseThemes/lightBaseTheme').default;
const getMuiTheme = require('material-ui/styles/getMuiTheme').default;

const mainTheme = require('../mainTheme').default;

/**************************************
 * Base Theme
 *************************************/

const muiTheme = getMuiTheme(lightBaseTheme, {
    palette: {
        disabledColor: fade(darkBlack, 0.5)
    }
});


/**************************************
 * App Bar
 *************************************/

muiTheme.appBar.color = mainTheme.backgroundColor;
muiTheme.appBar.textColor = mainTheme.foregroundColor;

muiTheme.toolbar.backgroundColor = mainTheme.backgroundColor;
muiTheme.toolbar.color = mainTheme.foregroundColor;

/**************************************
 * Bottom Navigation
 *************************************/

muiTheme.bottomNavigation.selectedColor = mainTheme.primaryColor;
muiTheme.bottomNavigation.selectedFontSize = 8;
muiTheme.bottomNavigation.unselectedFontSize = 6;

/**************************************
 * Buttons
 *************************************/

muiTheme.flatButton.primaryTextColor = mainTheme.primaryColor;
muiTheme.floatingActionButton.color = mainTheme.primaryColor;
muiTheme.raisedButton.primaryColor = mainTheme.primaryColor;

/**************************************
 * Checkbox
 *************************************/

muiTheme.checkbox.checkedColor = mainTheme.primaryColor;

/**************************************
 * Sub Header
 *************************************/

muiTheme.subheader.color = mainTheme.primaryColor;

/**************************************
 * Text Field
 *************************************/

muiTheme.textField.focusColor = mainTheme.primaryColor;
muiTheme.textField.disabledTextColor = fade(darkBlack, 0.6);

//-------------------------------------
// Stepper
//-------------------------------------

muiTheme.stepper.iconColor = '#7ca654';

export default muiTheme;