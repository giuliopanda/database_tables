<?php
/**
 * Gestisco il filtri e hook per la schermata information-schema
 * 
 *
 * @package    database-table
 * @subpackage database-table/includes
 */
namespace DatabaseTables;

class Dbt_loader_information_schema {
    public function __construct() {
		// Questa una chiamata crea una tabella e ridirige alla struttura
		add_action( 'admin_post_dbt_create_table', [$this, 'create_table']);	
		// svuota una tabella
		add_action( 'admin_post_dbt_empty_table', [$this, 'empty_table']);	
		// elimina una tabella
		add_action( 'admin_post_dbt_drop_table', [$this, 'drop_table']);	
		// elimina una tabella
		add_action( 'wp_ajax_dbt_dump_table', [$this, 'dump_table']);	
        // Scarica il file sql
		add_action( 'admin_post_dbt_download_dump', [$this, 'dbt_download_dump']);
	}
    /**
     * Creo la tabella
     */
    public function create_table() {
        global $wpdb;
        Dbt_fn::require_init();
        //TODO IN LAVORAZIONE
        if (!isset($_REQUEST['new_table'])) {
            wp_redirect( admin_url("admin.php?page=database_tables&section=information-schema&msg=no_created_table"));
        }
        $use_prefix = (isset($_REQUEST['use_prefix']) && $_REQUEST['use_prefix'] == 1);
        $table_model = new Dbt_model_structure($_REQUEST['new_table']);
        $table_model->change_unique_table_name($_REQUEST['new_table'], $use_prefix);
        $table_model->insert_column('id', 'INT', 11,  "", true, false, true, false);
       
        $sql = $table_model->get_create_sql();
        $result = $wpdb->query($sql);
        if (is_wp_error($result) || !empty($wpdb->last_error)) {
            wp_redirect( admin_url("admin.php?page=database_tables&section=information-schema&msg=no_created_table"));
        } else {
            Dbt_fn::update_dbt_option_table_status($table_model->get_table_name(), 'DRAFT');
        }
        $link =  admin_url("admin.php?page=database_tables&section=table-structure&action=structure-edit&table=".$table_model->get_table_name()."&msg=created_table");
        wp_redirect($link);
    }
    /**
     * Svuota la tabella
     */
    public function empty_table() {
        global $wpdb;
        Dbt_fn::require_init();
        //TODO IN LAVORAZIONE
        if (!isset($_REQUEST['table'])) {
            wp_redirect( admin_url("admin.php?page=database_tables&section=information-schema&msg=no_table_selected"));
        }
        $table_options = Dbt_fn::get_dbt_option_table($_REQUEST['table']);
        if ($table_options['status'] == "DRAFT") {
            if ($wpdb->query("TRUNCATE TABLE `".esc_sql($_REQUEST['table'])."`")) {
                wp_redirect( admin_url("admin.php?page=database_tables&section=information-schema&msg=empty_table_ok"));
            } else {
                wp_redirect( admin_url("admin.php?page=database_tables&section=information-schema&msg=empty_table_mysql_error"));
            }
        } else {
            wp_redirect( admin_url("admin.php?page=database_tables&section=information-schema&msg=no_allow_empty_table"));
        }
    }
    /**
     * Elimina la tabella
     */
    public function drop_table() {
        global $wpdb;
        Dbt_fn::require_init();
        //TODO IN LAVORAZIONE
        if (!isset($_REQUEST['table'])) {
            wp_redirect( admin_url("admin.php?page=database_tables&section=information-schema&msg=no_table_selected"));
        }
        $table_options = Dbt_fn::get_dbt_option_table($_REQUEST['table']);
        if ($table_options['status'] == "DRAFT") {
            if ($wpdb->query("DROP TABLE `".esc_sql($_REQUEST['table'])."`")) {
              //  delete_option('dbt_'.$_REQUEST['table']);
                Dbt_fn::delete_dbt_option_table_status($_REQUEST['table']);
                wp_redirect( admin_url("admin.php?page=database_tables&section=information-schema&msg=drop_table_ok"));
            } else {
                wp_redirect( admin_url("admin.php?page=database_tables&section=information-schema&msg=drop_table_mysql_error"));
            }
        } else {
            wp_redirect( admin_url("admin.php?page=database_tables&section=information-schema&msg=no_allow_drop_table"));
        }
    }

     /**
     * dump di una tabella
     */
    public function dump_table() {
        global $wpdb;
        Dbt_fn::require_init();
        $table = $_REQUEST['table'];
		$sql = 'SHOW CREATE TABLE `'.esc_sql($table).'`';
		$result = $wpdb->get_row($sql, 'ARRAY_A');
        
        if (isset($_REQUEST['limit_start'])) {
            $limit_start = $_REQUEST['limit_start'];
        } else {
            $limit_start = 0;
        }
        $temp_file = new Dbt_temporaly_files();
        if ($limit_start == 0 ) {
            if (isset($result['Create Table'])) {
                $table_structure = $result['Create Table'];
            } else {
                return '';
            }
           
            $filename = $temp_file->append($table_structure.";" . PHP_EOL . PHP_EOL);
        } else {
            $filename = $_REQUEST['filename'];
        }
        $sql = 'SELECT count(*) as tot FROM  `'.esc_sql($table).'`';
        $tot = $wpdb->get_var($sql);

        $sql = 'SELECT * FROM  `'.esc_sql($table).'` LIMIT '.absint($limit_start).', 5000';
        $rows = $wpdb->get_results($sql);
        $insert_rows = [];
        if (is_countable($rows)) {
            foreach ($rows as $row) {
                $insert_values_key = $insert_values_val = [];
                foreach ($row as $key=>$value) {
                    $insert_values_key[] = '`'.$key.'`'; 
                    $insert_values_val[] = "'".esc_sql($value)."'";
                }
                $insert_rows[] = 'INSERT INTO `'.esc_sql($table).'` ('.
                implode(", ", $insert_values_key).
                ') VALUES ('.implode(",",$insert_values_val).');' ;
            }
            $temp_file->append(implode(PHP_EOL, $insert_rows), $filename);
        }
      //  print " FILE NAME ". $filename." ";
        $link = admin_url('admin-post.php?section=information-schema&action=dbt_download_dump&fnid=' . $filename."&table=".$table);  
        $ris  = ['filename' => $filename, 'download'=>$link, 'tot'=>absint($tot), 'exec'=>count($rows), 'limit_start'=>absint($limit_start), 'table'=> $table , 'div_id'=> $_REQUEST['div_id']];
        wp_send_json($ris);
		die();
    }

    /**
	 * Scarica il dump
	 */
	public function dbt_download_dump() {
		Dbt_fn::require_init();
       
		$temporaly = new Dbt_temporaly_files();
		$fnid = Dbt_fn::sanitaze_request('fnid','');
		$table = Dbt_fn::sanitaze_request('table','');
		$data = $temporaly->read($fnid);

        header("Cache-Control: public");
        header("Content-Description: File Transfer");
        header("Content-Disposition: attachment; filename = ".$table."_".date('Ymd_His').".sql");
        header("Content-Type: application/zip");
        header("Content-Transfer-Encoding: binary");
        
        // Read the file
        echo $data;
        die;


	}
}