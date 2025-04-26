
-- CREATE TYPE LeaderType2 AS (
--     id INT,
--     identifier TEXT,
--     firstname TEXT,
--     lastname TEXT,
--     fullname TEXT,
--     department TEXT,
--     phonenumber TEXT,
--     email TEXT,
--     team TEXT,
--     workerrole TEXT,
--     updatedat TIMESTAMP,
--     fullnamereverse TEXT,
--     ispresent BOOLEAN,
--     validate BOOLEAN,
--     isactive BOOLEAN,
--     isconfirmed BOOLEAN,
-- );

CREATE OR REPLACE FUNCTION get_search_results(search_text TEXT)
RETURNS SETOF record
LANGUAGE sql
AS $$
    SELECT 
        p.id, 
        p.identifier, 
        p.firstname, 
        p.lastname, 
        p.fullname, 
        p.department, 
        p.phonenumber,
        p.email,
        p.team,
        p.workerrole,
        p.updatedat,
        p.fullnamereverse,
        p.ispresent,
        p.validate,
        p.isactive,
        p.isconfirmed,
        p.campus
    FROM 
        leader p
    WHERE 
        p.firstname ILIKE '%' || search_text || '%'
        OR p.lastname ILIKE '%' || search_text || '%'
        OR p.phonenumber ILIKE '%' || search_text || '%'
        OR p.fullname ILIKE '%' || search_text || '%'
        OR p.fullnamereverse ILIKE '%' || search_text || '%'
        OR p.team ILIKE '%' || search_text || '%'
        OR p.department ILIKE '%' || search_text || '%'
        OR p.email ILIKE '%' || search_text || '%'
        OR p.campus ILIKE '%' || search_text || '%'
$$;
