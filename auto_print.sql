create or replace package body auto_print is
-------------------------------------------------------------------------------------------------------------------------------------------------------------
procedure get_images(p_cle_groupe in varchar2) is
  my_json JSON_OBJECT_T;
  L_JSON_LIST CLOB;
begin
  select json_arrayagg(json_object(
                           KEY 'cle_auto_print' value CLE_AUTO_PRINT,
                           KEY 'url' value lob.GET_ORIGINAL_URL(CLE_LOB)) RETURNING CLOB)
  into L_JSON_LIST
  from AUTO_PRINTS
  where PNT_PRINTED = 'N';
  
  PRINT(L_JSON_LIST);
end;
-------------------------------------------------------------------------------------------------------------------------------------------------------------
procedure add_image(p_cle_groupe in varchar2,
                    p_cle_lob in varchar2) is
begin
  insert into AUTO_PRINTS (CLE_LOB, CLE_GROUPE) values (p_cle_lob, p_cle_groupe);
  commit;
end;
-------------------------------------------------------------------------------------------------------------------------------------------------------------
procedure remove_image(p_cle_groupe in varchar2,
                       p_cle_auto_print in varchar2) is
begin
  update AUTO_PRINTS
  set PNT_PRINTED = 'O'
  where CLE_AUTO_PRINT = p_cle_auto_print;
  PRINT(SQL%ROWCOUNT||' ligne a été supprimée');
  commit;
end;
-------------------------------------------------------------------------------------------------------------------------------------------------------------
procedure api(p_cle_groupe in varchar2 default null,
              p_cle_auto_print in varchar2 default null,
              p_cle_lob in varchar2 default null) is
begin
  if (owa_util.get_cgi_env('REQUEST_METHOD') = 'GET') then
    get_images(p_cle_groupe);
  elsif (owa_util.get_cgi_env('REQUEST_METHOD') = 'POST') then
    add_image(p_cle_groupe,p_cle_lob);
  elsif (owa_util.get_cgi_env('REQUEST_METHOD') = 'DELETE') then
    remove_image(p_cle_groupe,p_cle_auto_print);
  end if;
end;
-------------------------------------------------------------------------------------------------------------------------------------------------------------
end;

create or replace package auto_print is
procedure api(p_cle_groupe in varchar2 default null,
              p_cle_auto_print in varchar2 default null,
              p_cle_lob in varchar2 default null);
end;