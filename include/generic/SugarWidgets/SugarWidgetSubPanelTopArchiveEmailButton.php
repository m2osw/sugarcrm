<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point: '.__FILE__);
/*********************************************************************************
 * SugarCRM Community Edition is a customer relationship management program developed by
 * SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
 * OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU Affero General Public License along with
 * this program; if not, see http://www.gnu.org/licenses or write to the Free
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301 USA.
 * 
 * You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
 * SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
 * 
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 * 
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "Powered by
 * SugarCRM" logo. If the display of the logo is not reasonably feasible for
 * technical reasons, the Appropriate Legal Notices must display the words
 * "Powered by SugarCRM".
 ********************************************************************************/

require_once "include/generic/SugarWidgets/SugarWidgetSubPanelTopButton.php";


class SugarWidgetSubPanelTopArchiveEmailButton extends SugarWidgetSubPanelTopButton
{
    function display(&$layout_def, $additionalFormFields = null, $nonbutton = false)
    {
        if(ACLController::moduleSupportsACL($layout_def['module'])
        && !ACLController::checkAccess($layout_def['module'], 'edit', true)
        || $layout_def['module'] == "History"
        && !ACLController::checkAccess("Emails", 'edit', true))
        {
            return '';
        }

        global $app_strings, $mod_strings, $currentModule;

        $title = $app_strings['LBL_TRACK_EMAIL_BUTTON_TITLE'];
        $value = $app_strings['LBL_TRACK_EMAIL_BUTTON_LABEL'];
        $this->module = 'Emails';

        $additionalFormFields = array();
        $additionalFormFields['type'] = 'archived';
        // cn: bug 5727 - must override the parents' parent for contacts (which could be an Account)
        $additionalFormFields['parent_type'] = $layout_def['focus']->module_dir; 
        $additionalFormFields['parent_id']   = $layout_def['focus']->id;
        $additionalFormFields['parent_name'] = $layout_def['focus']->name;

        if(isset($layout_def['focus']->email1))
        {
            $additionalFormFields['to_email_addrs'] = $layout_def['focus']->email1;
        }
        if(ACLController::moduleSupportsACL($layout_def['module'])
        && !ACLController::checkAccess($layout_def['module'], 'edit', true))
        {
            $button = "<input id='".preg_replace('[ ]', '', $value)."_button'  title='$title' class='button' type='button' name='".preg_replace('[ ]', '', strtolower($value))."_button' value='$value' disabled/>\n";
            return $button;
        }
        $button = $this->_get_form($layout_def, $additionalFormFields);
        $button .= "<input id='".preg_replace('[ ]', '', $value)."_button' title='$title' class='button' type='submit' name='".preg_replace('[ ]', '', strtolower($value))."_button' value='$value'/>\n";
        $button .= "</form>";
        return $button;
    }
}

// vim: ts=4 sw=4 et
