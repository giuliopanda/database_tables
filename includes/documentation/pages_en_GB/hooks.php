<?php 
namespace DatabaseTables;
if (!defined('WPINC')) die;
?>

<div class="dbt-content-table dbt-docs-content  js-id-dbt-content" >

    <h2 class="dbt-h2"> <a href="<?php echo admin_url("admin.php?page=dbt_docs") ?>">Doc</a><span class="dashicons dashicons-arrow-right-alt2"></span><?php _e('Hooks & filters','database_tables'); ?></h2>
    <hr>
    <h2 class="dbt-h2"> apply_filter('<b>dbt_frontend_link_columns_to_link_to</b>', $selected, $list_id, $columns);</h2>
    In the frontend tables it allows you to decide which columns to link to to show the detail
    <hr>
    <h4 class="dbt-h4">Parameters</h4>
    <div class="dbt-help-p">
        <ul>
            <li><b>$selected</b>
                <br>(Array) The names of the columns to which to insert the link for the detail.
            </li>
            <li><b>$list_id</b>
                <br>(int) The id of the list
            </li>
            <li><b>$columns</b>
                <br>(Array) The names of the columns in the table
            </li>
        </ul>
        </div>
    <h4  class="dbt-h4">Source</h4>
    <div class="dbt-help-p">./includes/dbt-functions.php</div>


    <h4 class="dbt-h4">Example</h4>
    <div class="dbt-help-p">
        <pre class="dbt-code">
        /**
        * In the frontend table: change which columns have the link to the detail (in this case all)
        */
        add_filter('dbt_frontend_link_columns_to_link_to', 'all_cols', 10, 3);
        function all_cols($selected, $dbt_id, $columns) {
            return $columns;
        }
        </pre>
    </div>

    <hr>
    <h2 class="dbt-h2"> apply_filters('<b>dbt_frontend_build_custom_link</b>', $custom_link, $dbt_id, $primary_values, $col_value, $col_key);</h2>
    In the frontend in the creation of custom links to open the detailed results.
    <hr>
    <h4 class="dbt-h4">Parameters</h4>
    <div class="dbt-help-p">
        <ul>
            <li><b>$custom_link</b>
                <br>(string) The link that will be displayed
            </li>
            <li><b>$list_id</b>
                <br>(int) The id of the list
            </li>
            <li><b>$primary_values</b>
                <br>(Array) 
            </li>
            <li><b>$col_value</b>
                <br>(string) 
            </li>
            <li><b>$col_key</b>
                <br>(string) 
            </li>
        </ul>
        </div>
    <h4  class="dbt-h4">Source</h4>
    <div class="dbt-help-p">./includes/dbt-functions.php</div>

    <h4 class="dbt-h4">Example</h4>
    <div class="dbt-help-p">
        The example shows loading data into a custom div. This is possible thanks to the javascript function setup_dbt_load_ajax_custom_div (el_container)
        <pre class="dbt-code">
        /**
        * In the frontend table: In the HTML where the shortcode [dbt_list id = xx] has been put I insert a custom html'<div id="dbt_div_target_link"></div>'
        */
        function load_in_custom_box($custom_link, $dbt_id, $primary_values, $col_value, $col_key) {
            return '<a class="js-dbt-load-ajax-custom-div" href="'.esc_url(add_query_arg($primary_values, admin_url('admin-ajax.php'))).'" target="_blank">'
            .strip_tags($col_value).'</a>';

        }
        add_filter('dbt_frontend_build_custom_link', 'load_in_custom_box', 10, 5);
        </pre>
    </div>


    <hr>
    <h2 class="dbt-h2">apply_filters('<b>dbt_frontend_total_items</b>', $total_items_text, $dbt_id, $total_items,  $limit, $curr_page, $pages );</h2>
    In the tables it changes the writing of the total of the elements
    <hr>
    <h4 class="dbt-h4">Parameters</h4>
    <div class="dbt-help-p">
        <ul>
            <li><b>$total_items_text</b>
                <br>(string) The text showing
            </li>
            <li><b>$list_id</b>
                <br>(int) The id of the list
            </li>
            <li><b>$total_items</b>
                <br>(int) The total number of items
            </li>
            <li><b>$limit</b>
                <br>(int) The number of items per page
            </li>
            <li><b>$curr_page</b>
                <br>(int) The current page
            </li>
            <li><b>$page</b>
                <br>(int) Il numero di pagine totali
            </li>
        </ul>
        </div>
    <h4  class="dbt-h4">Source</h4>
    <div class="dbt-help-p">./includes/dbt-html-table-frontend.php</div>

    <h4 class="dbt-h4">Example</h4>
    <div class="dbt-help-p">
        <pre class="dbt-code">
        /**
        * In the frontend table: Show alternate text in the total displayed elements of a table
        */
        function dbt_total_items( $total_items_text, $dbt_id, $total_items,  $limit, $curr_page, $pages) {
            $min = (($curr_page -1) * $limit) + 1;
            $max = (($curr_page) * $limit);
            return sprintf( "Showing %s to %s of %s entries", $min, $max, $total_items);
        }

        add_filter('dbt_frontend_total_items', 'dbt_total_items', 10, 6);
        </pre>
    </div>





    <hr>
    <h2 class="dbt-h2">apply_filters('<b>dbt_frontend_table_thead</b>', header_text, $dbt_id, $array_thead);</h2>
    In the frontend print the table titles.
    <hr>
    <h4 class="dbt-h4">Parameters</h4>
    <div class="dbt-help-p">
        <ul>
            <li><b>$header_text</b>
                <br>(string) The text showing
            </li>
            <li><b>$list_id</b>
                <br>(int) The id of the list
            </li>
            <li><b>$array_thead</b>
                <br>(Array) The data to print the columns
            </li>
        </ul>
        </div>
    <h4  class="dbt-h4">Source</h4>
    <div class="dbt-help-p">./includes/dbt-html-table-frontend.php</div>

    <h4 class="dbt-h4">Example</h4>
    <div class="dbt-help-p">
        <pre class="dbt-code">
        /**
        * Hide the header
        */
        function dbt_total_items($header_text, $dbt_id, $array_thead) {
            return '';
        }

        add_filter('dbt_frontend_table_thead', 'dbt_hide_thead', 10, 3);
        </pre>
    </div>

    

    <hr>
    <h2 class="dbt-h2">apply_filters('<b>dbt_table_status</b>', $status, $table);</h2>
    Change the state of a table (DRAFT|PUBLISH|CLOSE)
    <hr>
    <h4 class="dbt-h4">Parameters</h4>
    <div class="dbt-help-p">
        <ul>
            <li><b>$status</b>
                <br>(string) The focus of the table
            </li>
            <li><b>$table</b>
                <br>(string) The name of the table
            </li>
        </ul>
        </div>
    <h4  class="dbt-h4">Source</h4>
    <div class="dbt-help-p">./includes/dbt-functions.php</div>

    <h4 class="dbt-h4">Example</h4>
    <div class="dbt-help-p">
        <pre class="dbt-code">
        /**
        * I prevent modification of the post table
        */
        function dbt_lock_post_table($status, $table) {
            global $wpdb; 
            // $status = DRAFT|PUBLISH|CLOSE
            if ($table == $wpdb->prefix."posts") {
                $status = 'CLOSE';
            }
            return $status;
        }

        add_filter('dbt_table_status', 'dbt_lock_post_table', 10, 2);
        </pre>
    </div>


    <hr>
    <h2 class="dbt-h2">apply_filters('<b>dbt_save_data</b>', $query_to_execute, $dbt_id, $origin)</h2>
    Edit the data you are about to save in the database
    <hr>
    <h4 class="dbt-h4">Parameters</h4>
    <div class="dbt-help-p">
        <ul>
            <li><b>$query_to_execute</b>
                <br>(array) of records that are about to be inserted or modified in the database
            </li>
            <li><b>$dbt_id</b>
                <br>(int) The name of the table
            </li>
            <li><b>$origin</b>
                <br>(string) Defines where the data is entered from
            </li>
        </ul>
        </div>
    <h4  class="dbt-h4">Source</h4>
    <div class="dbt-help-p">./includes/dbt-list-functions.php</div>

    <h4 class="dbt-h4">Example</h4>
    <div class="dbt-help-p">
        <pre class="dbt-code">
    /**
    * I save a post and change the title from the filter
    */
    function test_dbt($status, $table) {
        $dbt_id = '[number_of_list_id]'; // it is a list that loads the post data;
        $row = new StdClass();
        $row->post_title = "new record";
        $ris = DatabaseTables\Dbt::save_data($dbtid, $row);
    }
    add_action( 'init', 'test_dbt' );
    
    function dbt_action_in_save_data($query_to_execute, $dbt_id, $where) {
        $query_to_execute[0]['sql_to_save']['post_title'] = "Change the title";
        return $query_to_execute;
    }
    add_filter('dbt_save_data', 'dbt_action_in_save_data', 10, 3);
        </pre>
    </div>



    <h2 class="dbt-h2">apply_filters( 'pinacode_attribute_tmpl_'.$param, $gvalue, $param, $shortcode_obj);</h2>
    If the template attribute is called it is possible to filter the passed parameter
    <hr>
    <h4 class="dbt-h4">Parameters</h4>
    <div class="dbt-help-p">
        <ul>
            <li><b>$gvalue</b>
                <br>(object) The focus of the table
            </li>
            <li><b>$param</b>
                <br>(string)
            </li>
            <li><b>$shortcode_obj</b>
                <br>(object)
            </li>
        </ul>
        </div>
    <h4  class="dbt-h4">Source</h4>
    <div class="dbt-help-p">./includes/pinacode/pina-attributes.php</div>
    
    <h4 class="dbt-h4">Example</h4>
    <div class="dbt-help-p">
        <pre class="dbt-code">
    add_filter('pinacode_attribute_tmpl', 'bold_pinacode_attribute_tmpl', 10, 3 );
    function bold_pinacode_attribute_tmpl( $param, $gvalue, $count_for ) {
    if ($param == "bold") {
        $item = PinaCode::get_var('item');
        $html = [];
        foreach ($item as $k=>$v) {
        $html[] = "<b>".$k."</b>";
        }
        $param = implode("", $html);
    }
    return $param;
    }
        </pre>
    </div>

</div>

