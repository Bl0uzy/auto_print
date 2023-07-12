create table AUTO_PRINTS
(
  CLE_AUTO_PRINT VARCHAR2(32) default sys_guid() not null,
  CLE_LOB varchar2(32) not null,
  CLE_GROUPE varchar2(32),
  PNT_PRINTED varchar2(1) default 'N',
  DATE_CREATION date default sysdate,
  timestamp date
)
/
alter table auto_prints
  add constraint PK_AUTO_PRINTS primary key (CLE_AUTO_PRINT)
/

alter table auto_prints
  add constraint FK_AUTO_PRINTS_LOB foreign key (CLE_LOB) references lobs(CLE_LOB)
/

create or replace trigger TRG_AUTO_PRINTS
  before insert or update
  on AUTO_PRINTS
  for each row
declare
begin
  if (:new.CLE_AUTO_PRINT is null) then
    :new.CLE_AUTO_PRINT := sys_guid();
  end if;
  :new.TIMESTAMP := sysdate;
end;
/
