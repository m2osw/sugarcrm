<?php
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


/**
 * ContactsViewRetrieveEmailUsername.php
 * 
 * This class overrides SugarView and provides an implementation for the RetrieveEmailUsername
 * method used for returning the information about an email address
 * 
 * @author Collin Lee
 * */
 
require_once('include/MVC/View/SugarView.php');
require_once("include/JSON.php");

class ContactsViewRetrieveEmail extends SugarView {
	
 	function ContactsViewRetrieveEmail(){
 		parent::SugarView();
 	}
 	
 	function process() {
		$this->display();
 	}

 	function display(){
	    $data = array();
	    $data['target'] = $_REQUEST['target'];
        if(!empty($_REQUEST['email'])) {
	        $db = DBManagerFactory::getInstance();
	        $email = $GLOBALS['db']->quote(strtoupper(trim($_REQUEST['email'])));
	        $result = $db->query("SELECT * FROM email_addresses WHERE email_address_caps = '$email' AND deleted = 0");
			if($row = $db->fetchByAssoc($result)) {
		        $data['email'] = $row;
			} else {
				$data['email'] = '';
			}
        }
        if (!defined('JSON_LOOSE_TYPE')) {
            define('JSON_LOOSE_TYPE', null);
        }
		$json = new JSON(JSON_LOOSE_TYPE);
		echo $json->encode($data); 
 	}	
}
?>