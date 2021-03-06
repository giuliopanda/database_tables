var dtf_edit = null;
var dbt_sql_check = "";
var dtf_alias_table = {};
jQuery(document).ready(function () {
    setInterval(function() {dbt_analyze_query()}, 3000);
   
});
   
/**
 * Verifica se l'editor deve essere aperto o chiuso dalla classe di default
 */
function check_toggle_sql_query_edit()  {
    console.log ('check_toggle_sql_query_edit');
    if (jQuery('#dbt_content_query_edit').hasClass('js-default-show-editor')) {
        show_sql_query_edit(dtf_sql_editor_height);
    } else {
        hide_sql_query_edit();
    }
}


/**
 * Fa apparire l'edit della query
 */
 function show_sql_query_edit(size_height)  {
    if (document.getElementById('sql_query_edit') != null) {
        /*
        jQuery('#dbt-bnt-edit-query').css('display','none');
        jQuery('#dbt-bnt-go-back-filter-query').css('display','none');
        jQuery('#dbt-bnt-go-query').css('display', 'inline-block');
        jQuery('#dbt-bnt-cancel-query').css('display', 'inline-block');
        jQuery('#sql_query_edit').css('display', 'none');
        jQuery('#result_query').css('display', 'none');
        jQuery('#dbt-bnt-reload-query').css('display', 'none');
*/
        jQuery('#sql_query_edit').css('display', 'none');
        jQuery('#result_query').css('display', 'none');
        jQuery('#dbt_content_query_edit').removeClass('js-default-hide-editor').addClass('js-default-show-editor');
        
        dtf_edit = wp.codeEditor.initialize(jQuery('#sql_query_edit'), editorSettings);
        document.getElementById('sql_query_edit').dtf_editor_sql = dtf_edit;
        dtf_edit.codemirror.on('keyup', function (cm, event) {
            // type code and show autocomplete hint in the meanwhile
            setTimeout(function () {
                if (!cm.state.completionActive)
                    cm.showHint({ hint: wp.CodeMirror.hint.database_tables, completeSingle: 0 });
            }, 100);
        });
        if (size_height > 0) {
            dtf_edit.codemirror.setSize(null, size_height);
        }
        dtf_edit.codemirror.focus();
    }
}


/**
 * Fa sparire l'edit della query
 */
 function hide_sql_query_edit() {
    if (typeof (document.getElementById('sql_query_edit').dtf_editor_sql) != "undefined") {
        /*
        jQuery('#dbt-bnt-edit-query').css('display','inline-block');
        jQuery('#dbt-bnt-go-back-filter-query').css('display','inline-block');
        jQuery('#dbt-bnt-go-query').css('display', 'none');
        jQuery('#dbt-bnt-cancel-query').css('display', 'none');
        jQuery('#dbt-bnt-reload-query').css('display', 'inline-block');
        jQuery('#result_query').css('display', 'block');
*/
        jQuery('#result_query').css('display', 'block');
        jQuery('#dbt_content_query_edit').removeClass('js-default-show-editor').addClass('js-default-hide-editor');
        
        document.getElementById('sql_query_edit').dtf_editor_sql;
        dtf_edit.codemirror.toTextArea();
        document.getElementById('sql_query_edit').dtf_editor_sql = undefined;
        jQuery('#sql_query_edit').css('display', 'none');
    }
}

/**
 * SUBMIT FORM
 */
 function dtf_submit_custom_query(el) {
     
    if ( document.getElementById('sql_query_edit') != null) {
        code = document.getElementById('sql_query_edit').dtf_editor_sql;
        if (typeof code != 'undefined' && code != null) {
            jQuery('#sql_query_edit').value = code.codemirror.getValue();
        }
        jQuery('#sql_query_edit').parents('form').submit();
    } else {
        jQuery(el).parents('form').submit();
    }
   
}


/**
 * CODE MIRROR CREATE
 */
 var dtf_cm_all = [];

if (typeof dtf_tables != 'undefined' && typeof dtf_cm_variables != 'undefined') {
     dtf_cm_all = dtf_cm_variables.concat(dtf_tables);
    var editorSettings = "";
} else if (typeof dtf_tables != 'undefined') {
    dtf_cm_all = dtf_tables;
}
jQuery(document).ready(function ($) {
    // https://codemirror.net/5/doc/manual.html
    wp.CodeMirror.defineMode("dtsql", function (config, parserConfig) {
         return {
             token: function (stream, state) {
                let dnext = true;
                if (stream.start > 0) {
                    stream.next();
                } else{
                    dnext = false;
                }
                if (stream.string.length > 10000)   {
                    while( stream.next() != null);
                    return null;
                }
                if (stream.string.length < 5000) {
                    let search_table_ch = [' ', '`', '.'];
                    let search_table_ch_2 = [' ', '`', ' '];
                    for (let i = 0; i <dtf_tables.length ; i++) {
                        for (let sh in search_table_ch) {
                            let search = search_table_ch_2[sh] + dtf_tables[i] +  search_table_ch[sh] ;
                            if (stream.match(search, true, true )) {
                                var word = stream.current();
                                if (!dnext ) stream.next();
                          
                            // console.log (" word"+word);
                                return "variable-2";
                            } 
                        }
                    }
                    for (let i in dtf_alias_table) {
                        for (let sh in search_table_ch) {
                            let search = search_table_ch_2[sh] + i +  search_table_ch[sh] ;
                            if (stream.match(search, true, true )) {
                                var word = stream.current();
                                if (!dnext ) stream.next();
                                // console.log (" word"+word);
                                return "variable-2";
                            } 
                        }
                    }
                }

                for (let i = 0; i < dtf_cm_variables.length ; i++) {
                    if (stream.match(dtf_cm_variables[i], true, true )) {
                        chpeek = stream.peek();
                        if (chpeek == " " || chpeek == "`" || chpeek == "." || typeof (chpeek) == 'undefined') {
                            var word = stream.current();
                            if (!dnext ) stream.next();
                            if (word.trim().toLowerCase() == dtf_cm_variables[i].trim().toLowerCase()) {
                                return "keyword bold";
                            } else {
                                return null;
                            }
                        }
                    }                   
                }
                if (!dnext ) stream.next();
                return null;
               
              
            },
        };
    });

    editorSettings = wp.codeEditor.defaultSettings ? _.clone(wp.codeEditor.defaultSettings) : {};
    editorSettings.codemirror = _.extend(
         {},
         editorSettings.codemirror,
         {
             indentUnit: 4,
             tabSize: 4,
             mode: 'dtsql'
         }
    );
      
    wp.CodeMirror.registerHelper("hint", "database_tables", function (editor, options) {
    });
         
    wp.CodeMirror.registerHelper("hint", "database_tables", function (editor, options) {
         var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
        
         var start = cur.ch, end = start;
         while (end <= curLine.length && curLine.charAt(end) != " " && curLine.charAt(end) != "[" && curLine.charAt(end) != "]" && curLine.charAt(end) != "=" && curLine.charAt(start - 1) != "'" && curLine.charAt(start - 1) != '"') ++end;
         while (start > 0 && curLine.charAt(start - 1) != " " && curLine.charAt(start - 1) != "'" && curLine.charAt(start - 1) != '"') --start;
         //console.log(cur.ch+ " START "+start+" END "+end);
         var list = [];
         var close = 0, end_close = 0;
         var open_tag = "";
         range_start = start;
 
         if (start != end) {
             tables = get_table_and_alias(editor.getValue());
             dtf_tables_used = tables[0];
             dtf_alias_table = tables[1];
             var curWord = curLine.slice(start, end);
             if (curWord.length >= 1) {
                // le tabelle
                for (let k in dtf_tables) {
                    if (('`' + dtf_tables[k] + '`').substring(0, curWord.length).toLowerCase() == curWord.toLowerCase()) {
                        list.push('`' + dtf_tables[k] + '`');
                    } else if (dtf_tables[k].substring(0, curWord.length).toLowerCase() == curWord.toLowerCase()) {
                        list.push('`' + dtf_tables[k] + '`');
                    }
                }

                 // i comandi sql
                 for (let k in dtf_cm_variables) {
                    if (dtf_cm_variables[k].substring(0, curWord.length).toLowerCase() == curWord.toLowerCase()) {
                        list.push(dtf_cm_variables[k]);
                    }
                }
                
                 // le colonne negli alias
                for (let alias in dtf_alias_table) {
                    if (typeof (dtf_columns[dtf_alias_table[alias]]) != 'undefined') {
                        let columns_used = dtf_columns[dtf_alias_table[alias]];
                        for (let k2 in columns_used) {
                            if ((('`' + alias + '`.' + columns_used[k2]).substring(0, curWord.length).toLowerCase() == curWord.toLowerCase() && curWord.length > 1 ) || ((alias + '.' + columns_used[k2]).substring(0, curWord.length).toLowerCase() == curWord.toLowerCase() && curWord.length > 1 ) || ((alias + '.`' + columns_used[k2] + '`').substring(0, curWord.length).toLowerCase() == curWord.toLowerCase() && curWord.length > 1 ) || (('`' + alias + '`.`' + columns_used[k2] + '`').substring(0, curWord.length).toLowerCase() == curWord.toLowerCase() && curWord.length > 1) || (( alias + '.' + columns_used[k2]).substring(0, curWord.length).toLowerCase() == curWord.toLowerCase() && curWord.length > 1)) {
                                if (list.indexOf('`' + alias + '`.`' + columns_used[k2] + '`') == -1) {
                                    list.push('`' + alias + '`.`' + columns_used[k2] + '`');
                                }
                            } else if (('`' + alias + '`').substring(0, curWord.length).toLowerCase() == curWord.toLowerCase()) {
                                if (list.indexOf('`' + alias + '`') == -1) {
                                    list.push('`' + alias + '`');
                                }
                            } else if (columns_used[k2].substring(0, curWord.length).toLowerCase() == curWord.toLowerCase()) {
                                if (list.indexOf('`' + alias + '`') == -1) {
                                    list.push('`' + alias + '`');
                                }
                            }
                        }

                    }
                }


                 // le colonne
                 for (let k in dtf_tables_used) {
                    if (typeof (dtf_columns[dtf_tables_used[k]]) != 'undefined') {
                        let columns_used = dtf_columns[dtf_tables_used[k]];
                        for (let k2 in columns_used) {
                            if ((('`' + dtf_tables_used[k] + '`.' + columns_used[k2] ).substring(0, curWord.length).toLowerCase() == curWord.toLowerCase() && curWord.length > 1) || (( dtf_tables_used[k] + '.' + columns_used[k2] ).substring(0, curWord.length).toLowerCase() == curWord.toLowerCase() && curWord.length > 1) || (( dtf_tables_used[k] + '.`' + columns_used[k2] + '`').substring(0, curWord.length).toLowerCase() == curWord.toLowerCase() && curWord.length > 1) 
                            || (('`' + dtf_tables_used[k] + '`.`' + columns_used[k2] + '`').substring(0, curWord.length).toLowerCase() == curWord.toLowerCase() && curWord.length > 1)  || (( dtf_tables_used[k] + '.' + columns_used[k2] + '').substring(0, curWord.length).toLowerCase() == curWord.toLowerCase() && curWord.length > 1)) {
                                list.push('`' + dtf_tables_used[k] + '`.`' + columns_used[k2] + '`');
                            } else if ((('`' + columns_used[k2] + '`').substring(0, curWord.length).toLowerCase() == curWord.toLowerCase()) || columns_used[k2].substring(0, curWord.length).toLowerCase() == curWord.toLowerCase()) {
                                list.push('`' + columns_used[k2] + '`');
                            }
                        }

                    }
                }

             }
         }
 
         if (list.length == 1) {
             if (curWord == list[0]) {
                 list = [];
             }
         }
         return { list: list, from: wp.CodeMirror.Pos(cur.line, start), to: wp.CodeMirror.Pos(cur.line, end) };
    });
 
    
 });

 function get_table_and_alias(text) {
    text = text.replaceAll(/[\n\r\t]/gm, ' ');
    var startTime = performance.now();
    dtf_alias_table = {};
    dtf_tables_used = [];
    let words = text.split(" ");
    words.pop();
    for (x in words) {
        words[x] = words[x].replaceAll("`", '');
        if ( words[x].indexOf('.') > -1) continue;
        x = parseInt(x);
        if (dtf_tables.indexOf(words[x]) > -1) {
            if (dtf_tables_used.indexOf(words[x]) == -1) {
                dtf_tables_used.push(words[x]);
            }
            if ((x+1) <= words.length && typeof(words[x + 1]) != 'undefined') {
                words[x + 1] =  words[x + 1].replaceAll("`", '').replaceAll(",", '');
                if (words[x+1].toLowerCase() == "as") {
                    if (x+2 <= words.length && typeof(words[x + 2]) != 'undefined') {
                        if (dtf_cm_variables.indexOf(words[x+2].toUpperCase()) == -1) {
                            words[x + 2] =  words[x + 2].replaceAll("`", '');
                            dtf_alias_table[words[x+2]] = words[x];
                        }
                    }
                } else if (dtf_cm_variables.indexOf(words[x+1].toUpperCase()) == -1) {
                    dtf_alias_table[words[x+1]] = words[x];
                    
                } 
            }
        }
    }
   // let endTime = performance.now();
    return ([dtf_tables_used, dtf_alias_table]);
   
 }

/**
 * I BOTTONI DELLE AZIONI DELLA QUERY TIPO ORGANIZE FIELDS ecc..
 */

 
/**
 * Chiamo un ajax che risponde tutte le possibili colonne della query che si sta visualizzando e quelle visualizzate.
 */
 function dbt_columns_sql_query_edit() {
    if (jQuery('#dbt-bnt-columns-query').hasClass('js-btn-disabled')) return;
    dbt_open_sidebar_popup('columns_sql');
    jQuery('#dbt_dbp_title > .dbt-edit-btns').remove();
    jQuery('#dbt_dbp_title').append('<div class="dbt-edit-btns"><h3>ORGANIZE COLUMNS</h3></div>');
    sql = dbt_get_sql_string();
    if ( sql != "") {
        jQuery.ajax({
            type : "post",
            dataType : "json",
            url : ajaxurl,
            cache: false,
            data : {action:'dbt_columns_sql_query_edit',sql:sql},
            success: function(response) {
                dbt_close_sidebar_loading();
                if (!response.msg) { 
                    jQuery('#dbt_dbp_title > .dbt-edit-btns').remove();
                    jQuery('#dbt_dbp_title').append('<div class="dbt-edit-btns"><h3>ORGANIZE COLUMNS</h3><div id="dbt-bnt-edit-query" class="dbt-submit" onclick="columns_sql_query_apply()">Apply</div></div>');
                    $form = jQuery('<form class="dbt-form-columns-query" id="dbt_form_columns_new_query"></form>');
                    $custom_query = jQuery('<textarea style="display:none" class="form-input-edit" name="sql" ></textarea>');
                    $custom_query.val(sql);
                    $form.append($custom_query);
                    $form.append('<p class="dtf-alert-info" style="margin-bottom:1rem">Select the columns you want to see and give them a custom name if you want.</p>');
                    let count_xxx = 0;
                    $sortable = jQuery('<div class="js-dragable-table"></div>')
                    for (x in response.all_fields) {
                        let checked = "";
                        let val_label = "";
                        if (x in response.sql_fields) {
                            checked = ' checked="checked"';
                            val_label = response.sql_fields[x];
                        }
                        $checkbox = jQuery('<div class="dbt-dropdown-line-flex js-dragable-item dbt-line-choose-columns"><span class="dbt-sort-choose-columns dashicons dashicons-sort js-dragable-handle"></span><label><span style="vertical-align:middle;margin-left:.5rem;"><input name="choose_columns['+count_xxx+']" type="checkbox" value="" style="vertical-align:middle"'+checked+'></span><div style="width:250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display:inline-block; margin:.2rem .5rem; vertical-align:middle">'+x+'</div></label> AS&nbsp;&nbsp;&nbsp; <input class="label_as" type="text" name="label['+count_xxx+']" ></div>');
                        $checkbox.find('input:checkbox').val(x);
                        $checkbox.find('.label_as').val(val_label);
                        $sortable.append($checkbox); 
                        count_xxx++;
                    }
                    $form.append($sortable);
                    jQuery('#dbt_dbp_content').append($form);
                
                    jQuery('.js-dragable-table').sortable({
                        items: '.js-dragable-item',
                        opacity: 0.5,
                        cursor: 'move',
                        axis: 'y',
                        handle: ".js-dragable-handle"
                    });
                } else {
                    jQuery('#dbt_dbp_content').append('<p class="dtf-alert-sql-error" style="margin-bottom:1rem">'+response.msg+'</p>');
                }

            }
        });
    } else {
        alert ("sql is empty");
    }
 }


  /**
  * Apre la sidebar per creare un merge con un'altra tabella
  */
function dbt_merge_sql_query_edit() {
    if (jQuery('#dbt-bnt-merge-query').hasClass('js-btn-disabled')) return;
    dbt_open_sidebar_popup('merge_sql');
    jQuery('#dbt_dbp_title').append('<div class="dbt-edit-btns"><h3>MERGE QUERY</h3></div>');
    sql = dbt_get_sql_string();
    if (sql != "") {
        jQuery.ajax({
            type : "post",
            dataType : "json",
            url : ajaxurl,
            cache: false,
            data : {action:'dbt_merge_sql_query_edit',sql:sql},
            success: function(response) {
                dbt_close_sidebar_loading();
                if (!response.msg) {
                    jQuery('#dbt_dbp_title > .dbt-edit-btns').remove();
                    jQuery('#dbt_dbp_title').append('<div class="dbt-edit-btns"><h3>MERGE QUERY</h3> <div id="dbt-bnt-edit-query" class="dbt-submit" onclick="merge_sql_query_apply()">Apply</div></div>');
                    $form = jQuery('<form class="dbt-form-merge-query" id="dbt_form_merge_new_query"></form>');
                    $custom_query = jQuery('<textarea style="display:none" class="form-input-edit" name="sql" ></textarea>');
                    $custom_query.val(sql);
                    $form.append($custom_query);
                    $form.append('<p class="dtf-alert-info" style="margin-bottom:1rem">A join is a method of linking data between one ( self-join) or more tables based on values of the common column between the tables.</p>');
                    
                    $field_row = jQuery('<div class="dbt-dropdown-line-flex dbt-form-row"></div>');
                    $field_label = jQuery('<label class="dbt-form-label">Origin</label>');
                    $field_select = jQuery('<select name="dbt_ori_field"></select>');
                    $field_row.append($field_label).append($field_select);
                    $form.append($field_row);
                    for (x in response.all_fields) {
                        $option = jQuery('<option></option>');
                        $option.text(response.all_fields[x]);
                        $option.val(x);
                        $field_select.append($option);
                    }

                    $form.append('<div class="dbt-dropdown-line-flex dbt-form-row"><label class="dbt-form-label">Join Method</label><select id="dbt_merge_join" name="dbt_merge_join" onchange="explain_join_in_merge(this)"><option value="INNER JOIN">Inner join</option><option value="LEFT JOIN">left join</option><option value="RIGHT JOIN">Right join</option></select></div><div id="dbt_explain_join" class="dtf-alert-info"></div>');


                    $field2_row = jQuery('<div class="dbt-dropdown-line-flex dbt-form-row"></div>');
                    $field2_label = jQuery('<label class="dbt-form-label">Table</label>');
                    $field2_select = jQuery('<select name="dbt_merge_table"></select>');

                    $field2_row.append($field2_label).append($field2_select);
                    $form.append($field2_row);
                    //console.log (response.all_tables);
                    for (x in response.all_tables) {
                        $option = jQuery('<option></option>');
                        $option.text(response.all_tables[x]);
                        $option.val(x);
                        $field2_select.append($option);
                    }
                    $field2_select.change(function() {
                        get_fields_in_merge_sidebar(this);
                    })


                    $form.append('<div class="dbt-dropdown-line-flex dbt-form-row"><label class="dbt-form-label">Columns</label><select id="dbt_merge_columns"  name="dbt_merge_column"></select></div>');
                    jQuery('#dbt_dbp_content').append($form);
                    jQuery('#dbt_merge_join').change();
                } else {
                    jQuery('#dbt_dbp_content').append('<p class="dtf-alert-sql-error" style="margin-bottom:1rem">'+response.msg+'</p>');
                }

            }
        });
    } else {
        alert("SQL is empty")
    }
}

/**
 * Trova le colonne di una tabella quando stai facendo il merge viene richiamato ogni volta che cambi il select con l'elenco delle tabelle.
 */
function get_fields_in_merge_sidebar(el_select) {
    jQuery('#dbt_merge_columns').empty();
    jQuery.ajax({
        type : "post",
        dataType : "json",
        url : ajaxurl,
        cache: false,
        data : {action:'dbt_merge_sql_query_get_fields',table:jQuery(el_select).val()},
        success: function(response) {
            //console.log (response.all_columns);
            for (x in response.all_columns) {
                $option = jQuery('<option></option>');
                $option.text(response.all_columns[x]);
                $option.val(response.all_columns[x]);
                jQuery('#dbt_merge_columns').append($option);
            }
            
        }
    });
}

/**
 * Mostra la spiegazione dei tre join
 */
function explain_join_in_merge(el) {
    let desc = {'LEFT JOIN':'LEFT JOIN: Returns all rows from the left table and matched records from the right table or returns null if it does not find any matching record.','RIGHT JOIN':'RIGHT JOIN: Returns all rows from the right-hand table, and only those results from the other table that fulfilled the join condition','INNER JOIN':'INNER JOIN: Returns only the matching results from table1 and table2:'};
    jQuery('#dbt_explain_join').empty().html(desc[jQuery(el).val()]);
}

/**
 * Invio i dati per il merge delle tabelle e ricevere la nuova query
 */
function merge_sql_query_apply() {
    if (jQuery('#dbt_merge_columns').val() == null) {
        alert ("You have to choose a table and a column to link");
        return;
    }
    dbt_open_sidebar_loading();
    jQuery('#dbt-query-box').empty().append('<div class="dbt-sidebar-loading"><div  class="dbt-spin-loader"></div></div>');
    var data = jQuery('#dbt_form_merge_new_query').serializeArray() ;
    data.push({name: 'action', value: 'dbt_edit_sql_query_merge'});
    data.push({name: 'section', value: 'table-browse'});
    jQuery.ajax({
        type : "post",
        dataType : "json",
        url : ajaxurl,
        cache: false,
        data : data,
        success: function(response) {
            if (response.msg) {
                alert(response.msg);
                dbt_close_sidebar_loading();
            } else {
                if (response.html != "") {
                    jQuery('#dbt-query-box').empty().append(response.html);
                    dbt_close_sidebar_popup();
                } else {
                    dbt_close_sidebar_loading();
                }
            } 
            jQuery('#result_query').html(query_color(jQuery('#result_query').text()));
            
            check_toggle_sql_query_edit();
            
        }
    });
}

/**
 * Invia la query con i select cambiati ad una funzione ajax che ricrea la query
 */
function columns_sql_query_apply() {
    var data = jQuery('#dbt_form_columns_new_query').serializeArray() ;
    data.push({name: 'action', value: 'dbt_edit_sql_query_select'});
    data.push({name: 'section', value: 'table-browse'});
    dbt_open_sidebar_loading();
    // TODO NON VA BENE PERCH?? se ritorna un errore ho il box con le textarea e l'editor vuoto!
    jQuery('#dbt-query-box').empty().append('<div class="dbt-sidebar-loading"><div  class="dbt-spin-loader"></div></div>');
    jQuery.ajax({
        type : "post",
        dataType : "json",
        url : ajaxurl,
        cache: false,
        data : data,
        success: function(response) {
            if (response.html != "" && !response.msg) {
                jQuery('#dbt-query-box').empty().append(response.html);
            } else if ( response.msg != ""){
                alert(response.msg);
            }
            dbt_close_sidebar_popup();
            jQuery('#result_query').html(query_color(jQuery('#result_query').text()));

            check_toggle_sql_query_edit();
        }
    });
}

/**
 * Il bottone per l'aggiunta dei metadata
 * Sistema pi?? automatico possibile!
 * prima seleziono la tabella dei metadata. 
 * Dall'elenco delle tabelle delle query cerco le tabelle dei metadati attraverso il nome
 * nome_tabella_al_singolare+meta
 * La tabella trovata deve avere i 4 campi gi?? defini: chiave primaria meta_id, tabella_al_singolare +_id meta_key, meta_value. 
 * Se non trovo tabelle spiego in dettaglio il motivo 
 * e chiedo se si vuole creare una tabella meta per una delle tabelle selezionate.
 * 
 */
function dbt_metadata_sql_query_edit() {
    if (jQuery('#dbt-bnt-metadata-query').hasClass('js-btn-disabled')) return;
    sql = dbt_get_sql_string();
    if ( sql != "") {
        dbt_open_sidebar_popup('add_metadata');
        jQuery('#dbt_dbp_title').append('<div class="dbt-edit-btns"><h3>ADD META DATA</h3></div>');
        jQuery.ajax({
            type : "post",
            dataType : "json",
            url : ajaxurl,
            cache: false,
            data : {action:'dbt_metadata_sql_query_edit', sql:sql},
            success: function(response) {
                dbt_close_sidebar_loading();
                $form = jQuery('<form class="dbt-form-addmeta-query" id="dbt_form_addmeta_new_query"></form>');
                let count_obj = 0;
                jQuery('#dbt_dbp_content').append($form);
                if (response.msg) {
                    $form.append('<p class="dtf-alert-sql-error">'+response.msg+'</p>');  
                } else {
                    $field_row = jQuery('<div class="dbt-dropdown-line-flex dbt-form-row"></div>');
                    $field_label = jQuery('<label class="dbt-form-label">Metadata table</label>');
                    $field_select = jQuery('<select name="dbt_meta_table" id="dbt_meta_table" onchange="dbt_metadata_sql_query_edit_step2()"></select>');
                    $field_checkbox = jQuery('<span> Add primary_key for edit <input type="checkbox" value="1" name="dbt_add_field_pri"></span>');
                    $field_row.append($field_label).append($field_select).append($field_checkbox);
                    $form.append($field_row);
                    for (x in response.all_tables) {
                        $option = jQuery('<option></option>');
                        $option.text(response.all_tables[x]);
                        $option.val(x);
                        $field_select.append($option);
                        count_obj++;
                    }
                    if (count_obj >= 1) {
                        // step 2 estraggo le colonne
                        dbt_metadata_sql_query_edit_step2();
                    }
                }
            }
        });
    } else {
        alert ("SQL is empty");
    }
}

/**
 * Estraggo i campi del metadata
 */
function dbt_metadata_sql_query_edit_step2() {
    sql = dbt_get_sql_string();
    if ( sql != "") {
        jQuery.ajax({
            type : "post",
            dataType : "json",
            url : ajaxurl,
            cache: false,
            data : {action:'dbt_metadata_sql_query_edit_step2', table2:jQuery('#dbt_meta_table').val(), sql:sql},
            success: function(response) {
                let count_xxx = 0;
                if (response.distinct.length > 0) {
                    jQuery('#dbt_dbp_title .dbt-edit-btns').empty();
                    jQuery('#dbt_dbp_title .dbt-edit-btns').append('<h3>ADD META DATA</h3><div id="dbt-bnt-edit-query" class="dbt-submit" onclick="dbt_addmeta_sql_query_apply()">Apply</div>');
                }
                jQuery('#container_metadata').remove();
                $container = jQuery('<div id="container_metadata"></div>');
                //console.log (response.selected);
                for (x in response.distinct) {
                    checked = "";
                    if (response.selected.indexOf(response.distinct[x]) > -1) {
                        checked = ' checked="checked"';
                    }
                    $checkbox = jQuery('<div class="dbt-dropdown-line-flex dbt-line-choose-columns"><label><span style="vertical-align:middle;margin-left:.5rem;"><input name="choose_meta['+count_xxx+']" type="checkbox" style="vertical-align:middle"'+checked+'></span><div style="width:250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display:inline-block; margin:.2rem .5rem; vertical-align:middle">'+response.distinct[x]+'</div></label> <input name="altreadychecked_meta['+count_xxx+']" type="hidden" class="already_checked"></div>');
                    $checkbox.find('input:checkbox').val(response.distinct[x]);
                    if (response.selected.indexOf(response.distinct[x]) > -1) {
                        $checkbox.find('input:hidden.already_checked').val(response.distinct[x]);
                    }
                    $container.append($checkbox); 
                    count_xxx++;
                }
                $pri = jQuery('<input name="pri_key" type="hidden">');
                $pri.val(response.pri)
                $parent_id = jQuery('<input name="parent_id"  type="hidden">');
                $parent_id.val(response.parent_id);
                $container.append($pri).append($parent_id);
                jQuery('#dbt_form_addmeta_new_query').append($container);
            }
        });
    } else {
        console.error('dbt_metadata_sql_query_edit_step2: sql is empty!')
    }
}

/**
 * Invia i dati per l'aggiunta nella query dei metadata
 */
function dbt_addmeta_sql_query_apply() {
    sql = dbt_get_sql_string();
    if ( sql != "") {
        var data = jQuery('#dbt_form_addmeta_new_query').serializeArray() ;
        data.push({name: 'action', value: 'dbt_edit_sql_addmeta'});
        data.push({name: 'section', value: 'table-browse'});
        data.push({name: 'sql', value: sql });
        dbt_open_sidebar_loading();
        jQuery('#dbt-query-box').empty().append('<div class="dbt-sidebar-loading"><div  class="dbt-spin-loader"></div></div>');
        jQuery.ajax({
            type : "post",
            dataType : "json",
            url : ajaxurl,
            cache: false,
            data : data,
            success: function(response) {
                if (response.sql) {
                    if (response.html != "") {
                        jQuery('#dbt-query-box').empty().append(response.html);
                    }
                    dbt_close_sidebar_popup();
                    jQuery('#result_query').html(query_color(jQuery('#result_query').text()));
                    check_toggle_sql_query_edit();
                }
            }
        });
    } else {
        console.error('dbt_addmeta_sql_query_apply: sql is empty!')
    }
}


/**
 * FINE BOTTONI DELLE AZIONI DELLA QUERY TIPO ORGANIZE FIELDS ecc..
 */

/**
 * Carico una ajax che verifica la query che si sta inserendo
 */
function dbt_analyze_query() {
    sql = dbt_get_sql_string();
    if (sql.length > 7) {
        if (dbt_sql_check != sql) {
            jQuery.ajax({
                type : "post",
                dataType : "json",
                url : ajaxurl,
                cache: false,
                data : {action:'dbt_check_query', sql:sql},
                success: function(response) {
                // console.log ('dbt_analyze_query:');
                //  console.log (jQuery('.js-result-query-btns .js-show-only-select-query'));
                jQuery('#dbt_sql_error_show').empty().addClass('dbt-hide');

                    if (response.error != "") {
                        if (response.error.indexOf('You have an error in your SQL syntax') == -1 ) {
                            jQuery('#dbt_sql_error_show').removeClass('dbt-hide').append(response.error);
                        }
                        jQuery('.js-result-query-btns .js-show-only-select-query').addClass('dbt-btn-disabled js-btn-disabled');
                    } else {
                        if (response.is_select == 1) {
                            jQuery('.js-result-query-btns .js-show-only-select-query').removeClass('dbt-btn-disabled js-btn-disabled');
                        }
                        if (response.is_select == 0) {
                            jQuery('.js-result-query-btns .js-show-only-select-query').addClass('dbt-btn-disabled js-btn-disabled');
                        }
                    }
                }
            });
        } 
        dbt_sql_check = sql;
    }
}

/**
 * Ritorna la query che si sta scrivendo
 * @return string 
 */
function dbt_get_sql_string() {
    let sql = "";
    if ( document.getElementById('sql_query_edit') != null) {
        code = document.getElementById('sql_query_edit').dtf_editor_sql;
        if (typeof code != 'undefined' && code != null) {
            sql = code.codemirror.getValue();
        } else {
            sql = jQuery('#sql_query_executed').val();
        }
    } else {
        return '';
    }
    return sql;
}