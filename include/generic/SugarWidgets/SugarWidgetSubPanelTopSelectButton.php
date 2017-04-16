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

require_once('include/generic/SugarWidgets/SugarWidgetSubPanelTopButton.php');


class SugarWidgetSubPanelTopSelectButton extends SugarWidgetSubPanelTopButton
{
    //button_properties is a collection of properties associated with the widget_class definition. layoutmanager
    function SugarWidgetSubPanelTopSelectButton($button_properties=array())
    {
        $this->button_properties=$button_properties;
    }

    public function getWidgetId($buttonSuffix = true)
    {
        // force 'false' for $buttonSuffix
        return parent::getWidgetId(false) . 'select_button';
    }

    public function getDisplayName()
    {
        return $GLOBALS['app_strings']['LBL_SELECT_BUTTON_LABEL'];
    }

    function display(&$layout_def, $additionalFormFields = null, $nonbutton = false)
    {
        global $app_strings;

        $initial_filter = '';

        $this->title     = $this->getTitle();
        $this->accesskey = $this->getAccesskey();
        $this->value     = $this->getDisplayName();

        if (is_array($this->button_properties)) {
            if( isset($this->button_properties['title'])) {
                $this->title = $app_strings[$this->button_properties['title']];
            }
            if( isset($this->button_properties['accesskey'])) {
                $this->accesskey = $app_strings[$this->button_properties['accesskey']];
            }
            if( isset($this->button_properties['form_value'])) {
                $this->value = $app_strings[$this->button_properties['form_value']];
            }
            if( isset($this->button_properties['module'])) {
                $this->module_name = $this->button_properties['module'];
            }
        }


        $focus = $layout_def['focus'];
        if(ACLController::moduleSupportsACL($layout_def['module']) && !ACLController::checkAccess($layout_def['module'], 'list', true)){
            $button = ' <input type="button" name="' . $this->getWidgetId() . '" id="' . $this->getWidgetId() . '" class="button"' . "\n"
                . ' title="' . $this->title . '"'
                . ' value="' . $this->value . "\"\n"
                .' disabled />';
            return $button;
        }

        //refresh the whole page after end of action?
        $refresh_page = 0;
        if(!empty($layout_def['subpanel_definition']->_instance_properties['refresh_page'])){
            $refresh_page = 1;
        }

        $subpanel_definition = $layout_def['subpanel_definition'];
        $button_definition = $subpanel_definition->get_buttons();

        $subpanel_name = $subpanel_definition->get_name();
        if (empty($this->module_name)) {
            $this->module_name = $subpanel_definition->get_module_name();
        }
        $link_field_name = $subpanel_definition->get_data_source_name(true);
        $popup_mode='Single';
        if(isset($layout_def['mode']))
        {
            $popup_mode = $layout_def['mode'];
        }
        if(isset($layout_def['initial_filter_fields']))
        {
            if(is_array($layout_def['initial_filter_fields']))
            {
                foreach($layout_def['initial_filter_fields'] as $value=>$alias)
                {
                    if(isset($focus->$value) and !empty($focus->$value))
                    {
                        $initial_filter .= "&".$alias . '='.urlencode($focus->$value);
                    }
                }
            }
        }
        $create="true";
        if(isset($layout_def['create']))
        {
            $create = $layout_def['create'];
        }
        $return_module = $_REQUEST['module'];
        $return_action = 'SubPanelViewer';
        $return_id = $_REQUEST['record'];

        //field_to_name_array
        $fton_array= array('id' => 'subpanel_id');
        if(isset($layout_def['field_to_name_array'])
        && is_array($layout_def['field_to_name_array']))
        {
            $fton_array = array_merge($fton_array, $layout_def['field_to_name_array']);
        }

        $return_url = "index.php?module=$return_module&action=$return_action&subpanel=$subpanel_name&record=$return_id&sugar_body_only=1";

        $popup_request_data = array(
                'call_back_function' => 'set_return_and_save_background',
                'form_name' => 'DetailView',
                'field_to_name_array' => $fton_array,
                'passthru_data' => array(
                    'child_field' => $subpanel_name,
                    'return_url' => urlencode($return_url),
                    'link_field_name' => $link_field_name,
                    'module_name' => $subpanel_name,
                    'refresh_page'=>$refresh_page,
                    ),
                );

        // bugfix #57850 add marketing_id to the request data to allow filtering based on it
        if (!empty($_REQUEST['mkt_id']))
        {
            $popup_request_data['passthru_data']['marketing_id'] = $_REQUEST['mkt_id'];
        }

        if (is_array($this->button_properties) && !empty($this->button_properties['add_to_passthru_data'])) 
        {
            $popup_request_data['passthru_data']= array_merge($popup_request_data['passthru_data'],$this->button_properties['add_to_passthru_data']);
        }

        if (is_array($this->button_properties) && !empty($this->button_properties['add_to_passthru_data']['return_type'])) {

            if ($this->button_properties['add_to_passthru_data']['return_type']=='report') {
                $initial_filter = "&module_name=". urlencode($layout_def['module']);
            }
        }
        //acl_roles_users_selectuser_button

        $json_encoded_php_array = $this->_create_json_encoded_popup_request($popup_request_data);
        return ' <input type="button" name="' . $this->getWidgetId() . '" id="' . $this->getWidgetId() . '" class="button"' . "\n"
            . ' title="' . $this->title . '"'
            . ' value="' . $this->value . "\"\n"
            . " onclick='open_popup(\"$this->module_name\",600,400,\"$initial_filter\",true,true,$json_encoded_php_array,\"$popup_mode\",$create);' />\n";
    }

    /**
     * @return string
     */
    protected function getTitle()
    {
        return translate('LBL_SELECT_BUTTON_TITLE');
    }

    /**
     * @return string
     */
    protected function getAccesskey()
    {
        return translate('LBL_SELECT_BUTTON_KEY');
    }
}

// vim: ts=4 sw=4 et
