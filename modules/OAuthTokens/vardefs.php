<?php
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point'.__FILE__);
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

$dictionary = (array) $dictionary;

$dictionary['OAuthToken'] = array('table' => 'oauth_tokens',
	'comment' => 'OAuth tokens',
	'audited'=>false,
	'fields' => array (
	  'id' =>
	  array (
	    'name' => 'id',
	    'vname' => 'LBL_ID',
	    'type' => 'id',
	    'required'=>true,
	    'reportable'=>true,
	    'comment' => 'Unique identifier'
	  ),
      'secret' =>
      array (
            'name' => 'secret',
            'type' => 'varchar',
            'len' => 32,
            'required' => true,
            'comment' => 'Secret key',
      ),
      'tstate' =>
      array (
            'name' => 'tstate',
            'type' => 'enum',
            'len' => 1,
            'options' => 'token_status',
            'required' => true,
            'comment' => 'Token state',

      ),
      'consumer' =>
      array (
            'name' => 'consumer',
            'type' => 'id',
            'required' => true,
            'comment' => 'Token related to the consumer',
      ),
      'token_ts' =>
      array (
            'name' => 'token_ts',
            'type' => 'long',
            'required' => true,
            'comment' => 'Token timestamp',
            'function' => array('name' => 'displayDateFromTs', 'returns' => 'html', 'onListView' => true)
      ),
      'verify' =>
      array (
            'name' => 'verify',
            'type' => 'varchar',
            'len' => 32,
            'comment' => 'Token verification info',
      ),
//      'authdata' =>
//      array (
//            'name' => 'verify',
//            'type' => 'text',
//            'comment' => 'Token auth data',
//      ),
	  'deleted' =>
	  array (
	    'name' => 'deleted',
	    'vname' => 'LBL_DELETED',
	    'type' => 'bool',
	    'default' => '0',
	    'reportable'=>false,
	    'required' => true,
	  	'isnull' => false,
	    'comment' => 'Record deletion indicator'
	  ),
	'callback_url' =>
      array (
            'name' => 'callback_url',
            'type' => 'url',
            'len' => 255,
            'required' => false,
            'comment' => 'Callback URL for Authorization',
      ),
      'consumer_link' =>
      array (
        'name' => 'consumer_link',
        'type' => 'link',
        'relationship' => 'consumer_tokens',
        'vname' => 'LBL_CONSUMER',
        'link_type' => 'one',
        'module'=>'OAuthKeys',
        'bean_name'=>'OAuthKey',
        'source'=>'non-db',
      ),
      'consumer_name' =>
	  array (
		    'name' => 'consumer_name',
		    'link'=>'consumer_link' ,
		    'vname' => 'LBL_CONSUMER',
		    'rname' => 'name',
		    'type' => 'relate',
		    'reportable'=>false,
		    'source'=>'non-db',
		    'table' => 'oauth_consumer',
		    'id_name' => 'consumer',
		    'module'=>'OAuthKeys',
		    'duplicate_merge'=>'disabled'
	  ),
	 'assigned_user_id' =>
		array (
			'name' => 'assigned_user_id',
			'rname' => 'user_name',
			'id_name' => 'assigned_user_id',
			'vname' => 'LBL_ASSIGNED_TO_ID',
			'group'=>'assigned_user_name',
			'type' => 'relate',
			'table' => 'users',
			'module' => 'Users',
			'reportable'=>true,
			'isnull' => 'false',
			'dbType' => 'id',
			'audited'=>true,
			'comment' => 'User ID assigned to record',
            'duplicate_merge'=>'disabled'
		),
	 'assigned_user_name' =>
	 array (
		    'name' => 'assigned_user_name',
		    'link'=>'assigned_user_link' ,
		    'vname' => 'LBL_ASSIGNED_TO_NAME',
		    'rname' => 'user_name',
		    'type' => 'relate',
		    'reportable'=>false,
		    'source'=>'non-db',
		    'table' => 'users',
		    'id_name' => 'assigned_user_id',
		    'module'=>'Users',
		    'duplicate_merge'=>'disabled'
	 ),
	 'assigned_user_link' =>
      array (
        'name' => 'assigned_user_link',
        'type' => 'link',
        'relationship' => 'oauthtokens_assigned_user',
        'vname' => 'LBL_ASSIGNED_TO_USER',
        'link_type' => 'one',
        'module'=>'Users',
        'bean_name'=>'User',
        'source'=>'non-db',
        'duplicate_merge'=>'enabled',
        'rname' => 'user_name',
        'id_name' => 'assigned_user_id',
        'table' => 'users',
  ),
  ),
    'indices' => array (
       'id'=>array('name' =>'oauthtokenpk', 'type' =>'primary', 'fields'=>array('id', 'deleted')),
       'state_ts'=>array('name' =>"oauth_state_ts", 'type' =>'index', 'fields'=>array('tstate','token_ts')),
       'consumer'=>array('name' =>"constoken_key", 'type' =>'index', 'fields'=>array('consumer')),
    ),
   'relationships'=>array(
        'consumer_tokens' =>
           array('lhs_module'=> 'OAuthKeys', 'lhs_table'=> 'oauth_consumer', 'lhs_key' => 'id',
   				'rhs_module'=> 'OAuthTokens', 'rhs_table'=> 'oauth_tokens', 'rhs_key' => 'consumer',
   				'relationship_type'=>'one-to-many'),
	  'oauthtokens_assigned_user' =>
           array('lhs_module'=> 'Users', 'lhs_table'=> 'users', 'lhs_key' => 'id',
           'rhs_module'=> 'OAuthTokens' , 'rhs_table'=> 'oauth_tokens', 'rhs_key' => 'assigned_user_id',
           'relationship_type'=>'one-to-many')
           )
);
