<div class="dbt-content-table dbt-docs-content  js-id-dbt-content">
<h2 class="dbt-h2"> <a href="<?php echo admin_url("admin.php?page=dbt_docs") ?>">Doc</a><span class="dashicons dashicons-arrow-right-alt2"></span><?php _e('Template engine advanced','database_tables'); ?></h2>


<h3>^POST</h3>
  <p>Carica i post di wordpress</p>
  <h4>Gli attributi sono</h4>
  <p>Per estrarre un articolo singolo</p>
  <p><b>id</b>= trova il post con un determinato id. Se è un array di id trova tutti i post con quegli array<br></p>
  <p>Per estrarre più articoli</p>
  <p>
  <p><b>type</b></p>= Il post_type (post, page ecc...) Di default è post. Se si vogliono caricare le immagini vedi l'alias di [^POST] <a href="<?php echo add_query_arg('get_page','pina-post-image.php', $link); ?>" >[^IMAGE]</a><br>
  <b>cat</b>= trova i post di una determinata categoria o di un gruppo di categorie. Accetta l'id, lo slug oppure un array di id<br>
  <b>!cat</b>= trova i post che non sono presenti in una determinata categoria o di un gruppo di categorie. Accetta l'id lo slug oppure un array di id<br>
  <b>author</b>= trova i post per un determinato autore. Se è un numero usa l'id altrimenti lo user_nicename (NON IL NOME)<br>
  <b>slug</b>= Cerca per lo slug.<br>
  <b>tag</b>= Certa un post che abbia almeno uno dei tag selezionati. è possibile scriverli in un oggetto oppure in una stringa.<br>
  <b>parent_id</b>= L'id del post padre.<br>
  <b>limit</b>= Limita il numero di articoli da visualizzare. Per default 10. metti -1 per averli tutti. <br>
  <b>offset</b>= Visualizza gli articoli a partire da<br>
  <b>order</b>= Il campo su cui ordinare<br>
  <b>ASC</b> Ordine crescente<br>
  <b>DESC</b> Ordine decrescente<br>
  Mostrare gli articoli associati in un certo periodo di tempo.<br>
  <b>year</b>= Gli articoli di un determinato anno (es 2020)<br>
  <b>month</b>= Gli articoli di un determinato mese (1-12)<br>
  <b>week</b>= Gli articoli di una determinata settimana (week)<br>
  <b>day</b>= Gli articoli di un determinato giorno (day)<br>
  <b>first</b>= Mostra i primi articoli inseriti. Per default 5. Sostituisce order, asc, desc, limit<br>
  <b>last</b>= Mostra gli ultimi articoli inseriti. Per default 5. Sostituisce order, asc, desc, limit<br>
  </p>
  <p>Ricerca nei postMeta:</p>
  <p>è possibile cercare nei postmeta inserendo il tipo di filtro nell'attributo meta_query. Se si vogliono ricercare più parametri questi possono essere aggiunti divisi da spazi. In automatico verranno collegati come AND. Se si vogliono aggiungere OR e AND all'interno della ricerca questi vengono inseriti come funzioni. Le condizioni all'interno della funzione vengono collegate dalla congiunzione logica inserita. </p>
  <pre class="dbt-code">meta_query=[: AND(a>=b
  OR (
  b<=var c!=ccc L IN (3,2,5,3,52,34) ) .c LIKE ("% ") 
                  .d=" [%pippo]" parametro=) c> 2 :]
  </pre>
  <p>Altri parametri:</p>
  <p><b>read_more</b>= Il testo da mettere nella variabile link_read_more. Se non presente aggiunge ... . Se light_load è presente il tag è inutilizzabile</p>
  <p><b>image</b>= La dimensione dell'immagine di apertura: thumbnail, medium, large, full. Se non impostata carica post-thumbnail</p>
  <p><b>light_load</b> Esclude dal caricamento i post_meta e altri dati aggiunti per semplificare la gestione dei post. Passare  0 o 1 è opzionale</p>
  <h4>La funzione ritorna</h4>
  <ul class="pina-return-properties">
    <li>id: int</li>
    <li>author: text</li>
    <li>*author_id: int</li>
    <li>*author_name: text</li>
    <li>*author_roles: array</li>
    <li>*author_email: text</li>
    <li>*author_link</li>
    <li>date: date</li>
    <li>content: text</li>
    <li>title: text</li>
    <li>*title_link: link</li>
    <li>*permalink: link</li>
    <li>guid: link</li>
    <li>excerpt: text</li>
    <li>status: text</li>
    <li>comment_status: text</li>
    <li>name: text</li>
    <li>modified: date</li>
    <li>parent: int</li>
    
    <li>menu_order: int</li>
    <li>type: text</li>
    <li>mime_type: text</li>
    <li>comment_count: int</li>
    <li>filter: text</li>
  
    <li>*read_more_link: link</li>
    <li>*image: html</li>
    <li>*image_link: text</li>
    <li>*image_id: int</li>
    <li>*[postmeta]</li>
  </ul>
    <p>Se presente l'attributo light_load questi dati non vengono caricati. Se il post type è attachment e mime_type è image, permalink, image e image_link vengono comunque caricati. 
    <p>A questi si aggiungono tutti i post meta.</p>   
      
  <h4>Esempi</h4>
  <pre class="dbt-code">
    [^POSt id=141 for=[:
    [%item for=[:<p><b>[%key]</b>: [%item trim_words] </p>:]]
    :]]
  </pre>

  <pre class="dbt-code">
    [^POST get={"id":"id","Titolo":"title_link", "Autore"=>"author_name"} type=post tmpl=table]
  </pre>
  <pre class="dbt-code">
  [^POST type=post light_load tmpl=[: &lt;p&gt;ITEM:[%key]) [%item.id]:[%item.title]&lt;/p&gt; :] class="custom-class"]
  </pre>


  <br><br>
  <h1>Carica le immagini [^IMAGE]</h1>
  <p>Carica le immagini </p>
  <b>Gli attributi sono gli stessi di <a href="<?php echo add_query_arg('get_page','post.php', $link); ?>" >^POST</a></b>
  <p>Viene aggiunto:</p>
  <p><b>post_id</b>= Trova tutte le immagini collegate ad un singolo post<br></p>
  <p><b>light_load</b>= è impostato su 0 (nei post è impostato su 1). Se si vuole caricare tutto si deve inserire light_load=0<br></p>
  <h3>La funzione ritorna</h3>
  <p>Ritorna gli stessi parametri di POST</p>
      
  <h3>Esempi</h3>
  <pre class="dbt-code">
  [^IMAGE class=my_gallery print=[%item.image] attr={"id":"myGallery"} ]
    :]]
  </pre>

  <h3>^USER</h3>
  <p>Carica i dati degli utenti</p>
  <h4>Gli attributi per filtrare l'utente sono:</h4>
  <p>id|slug|email|login</p>
  <p>Se non viene inserito nessun parametro ritorna l'utente loggato</p>
  <h4>La funzione ritorna</h4>
  <ul class="pina-return-properties">
    <li>id: int</li>
    <li>login: string</li>
    <li>email: string</li>
    <li>reoles: array</li>
    <li>registered: string</li>
    <li>nickname: string</li>
    <li>wpx_capabilities: array</li>
    <li>wpx_user_level: int</li>
    <li>meta_*: Altri metadata</li>
  </ul>
  <h3>Esempi</h3>
  <pre class="dbt-code">
[^user.login id=1]
  </pre>
  <pre class="dbt-code">
[^IF "administrator" IN [^user.roles id=[%data.author]]]
  [^RETURN is administrator]
[^ELSE]
  [^RETURN is not administrator]
[^ENDIF]
  </pre>




  <h3>^USER</h3>
  <p>Carica i dati degli utenti</p>
  <h4>Gli attributi per filtrare l'utente sono:</h4>
  <p>id|slug|email|login</p>
  <p>Se non viene inserito nessun parametro ritorna l'utente loggato</p>
  <h4>La funzione ritorna</h4>
  <ul class="pina-return-properties">
    <li>id: int</li>
    <li>login: string</li>
    <li>email: string</li>
    <li>reoles: array</li>
    <li>registered: string</li>
    <li>nickname: string</li>
    <li>wpx_capabilities: array</li>
    <li>wpx_user_level: int</li>
    <li>meta_*: Altri metadata</li>
  </ul>
  <h3>Esempi</h3>
  <pre class="dbt-code">
[^user.login id=1]
  </pre>
  <pre class="dbt-code">
[^IF "administrator" IN [^user.roles id=[%data.author]]]
  [^RETURN is administrator]
[^ELSE]
  [^RETURN is not administrator]
[^ENDIF]
  </pre>






<h2>Gli oggetti</h2> 
    <p>Tra oggetti e array non c'è distinzione in pinacode. Tutti i contenuti che hanno al loro interno più informazioni (tipo un post di wordpress) sono oggetti. Questi possono essere settati scrivendo i dati in json (con virgolette doppie). </p>   
    <pre class="dbt-code">
    [^SET person={"name":"Foo", "age":"24"}]
    name: [person.name] age:[person get=age]
    </pre>

    <p>Per aggiungere nuove righe:</p>
    <pre class="dbt-code">
    [^SET people.[]=[%person]]
    [^SET people.[]=[%person2]]
    </pre>
    oppure
    <pre class="dbt-code">
    [^SET people.0=[%person]]
    [^SET people.1=[%person2]]
    </pre>
    <p>Attenzione non è possibile aggiungere parametri dinamici dentro un json</p>
    <pre class="dbt-code">
    [^SET people=[[%person],[%person2]]] [// NON FUNZIONA //]
    </pre>
    <p>Se si vuole modificare una poprietà di un oggetto bisognerà scrivere </p>
    <pre class="dbt-code">[^SET person.age=32]</pre> 

    <p>Creando un attributo con il punto Aggiunge una proprietà ad una variabile.</p>
    <pre class="dbt-code">[^POST type=post .myvar="custom"]</pre>


    <h2>IN PHP</h2>
    <pre class="dbt-code">
    &lt;?php 
        PinaCode-&gt;set_var(&quot;myvar&quot;,&quot;foobar&quot;); 
        echo PinaCode-&gt;get_var(&quot;myvar&quot;,&quot;default&quot;); 
    ?&gt;
    </pre>

    <h2>GET DATA</h2>
    <h3>TRAMITE SHORTCODE</h3>
    <p>Ogni variabile genera uno shortcode con il nome della variabile stessa. Per stampare una variabile basterà quindi scrivere nell'articolo stesso</p>
    <pre class="dbt-code">[%myval]</pre>

    <p>Se è un oggetto è possibile richiamare le proprietà dell'oggettro tramite</p>
    <pre class="dbt-code">[%person.age]</pre>
    <p>Questo ritornerà l'età della persona.</p>

    <p>Se è un array di oggetti allora ritornerà l'elenco delle età di tutte le persone</p>
    <pre class="dbt-code">[%people.age]</pre>

    <p>Per avere l'età di una persona specifica (ad esempio la prima) bisognerà scrivere</p>
    <pre class="dbt-code">[%people.0.age]</pre>

    <pre class="dbt-code">
        [^POST.title type=post] [// La funzione post estre gli articoli di wordpress, se si chiede il titolo verranno estratti solo i titoli degli articoli selezionati //]
    </pre>

    <h3>IN PHP</h3>
    <pre class="dbt-code">
    &lt;?php 
        $myreg = new PcRegistry();
        echo PinaCode-&gt;get_var(&quot;myvar&quot;);
        echo $myreg-&gt;get_var(&quot;people.0.age&quot;);
    ?&gt;
    </pre>

    <h2>USO PARTICOLARE DEI DATI</h2>
    <pre class="dbt-code">
    [^SET person=giulio]
    Stampa person: [[person] uppercase]
    </pre>
    <pre class="dbt-code">
    Stampa person: ["Giulio" uppercase]
    </pre>
    Array:
    <pre class="dbt-code">
    [SET person={"name":"Foo", "age":"24"}]
    [[person.name]]<br>
    [person get=age]
    [SET person2={"name":"Bar", "age":"32"}]
    <hr>
    <p> PEOPLE 1 NAME: [people.1.name]</p>
    </pre>



