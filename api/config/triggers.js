const v_job = `
    BEGIN              
        PERFORM PG_NOTIFY('main', JSON_BUILD_OBJECT(
            'action', 'v_jobs'
        )::text);
        RETURN NULL;
    END;
`

export default [



    // ----------------------
    // Refresh v_jobs
    // ----------------------

    {
        definition: `AFTER INSERT OR UPDATE OR DELETE ON jobs FOR EACH STATEMENT`,
        function: v_job
    },
    {
        definition: `AFTER UPDATE OF geometry, components_en, components_nl, address_en, address_nl ON locations FOR EACH STATEMENT`,
        function: v_job
    },
    {
        definition: `AFTER UPDATE OF name, image ON companies FOR EACH STATEMENT`,
        function: v_job
    },
    {
        definition: `AFTER INSERT OR DELETE ON jobs_images FOR EACH STATEMENT`,
        function: v_job
    },
    {
        definition: `AFTER INSERT OR DELETE ON companies_branches FOR EACH STATEMENT`,
        function: v_job
    },
    {
        definition: `AFTER INSERT OR UPDATE OR DELETE ON jobs_keywords FOR EACH STATEMENT`,
        function: v_job
    },
    {
        definition: `AFTER UPDATE OR DELETE ON branches FOR EACH STATEMENT`,
        function: v_job
    },
    {
        definition: `AFTER UPDATE OR DELETE ON categories FOR EACH STATEMENT`,
        function: v_job
    },
    {
        definition: `AFTER UPDATE OR DELETE ON education_levels FOR EACH STATEMENT`,
        function: v_job
    },
    {
        definition: `AFTER UPDATE OR DELETE ON education_fields FOR EACH STATEMENT`,
        function: v_job
    },
    {
        definition: `AFTER UPDATE OR DELETE ON education_paths FOR EACH STATEMENT`,
        function: v_job
    },





    // ----------------------
    // Rooms messaged_at
    // ----------------------

    {
        definition: `AFTER INSERT ON messages FOR EACH ROW`,
        function: `
            BEGIN
                UPDATE rooms
                SET messaged_at = NEW.created_at
                WHERE id = NEW.room;
                RETURN NULL;
            END;
        `,
    },



    // ----------------------
    // Archived
    // ----------------------

    {
        definition: `AFTER UPDATE OF archived ON locations FOR EACH ROW`,
        function: `
            BEGIN
                UPDATE jobs
                SET archived = NEW.archived
                WHERE location = NEW.id;
                RETURN NULL;
            END;
        `,
    },

    {
        definition: `AFTER UPDATE OF archived ON jobs FOR EACH ROW`,
        function: `
            BEGIN
                IF NEW.archived IS TRUE THEN
                    UPDATE applications
                    SET company_archived = true
                    WHERE room IN (SELECT id FROM rooms WHERE job = NEW.id);
                END IF; 
                RETURN NULL;               
            END;
        `,
    },

    {
        definition: `AFTER UPDATE OF company_archived ON applications FOR EACH ROW`,
        function: `
            BEGIN   
                 IF NEW.company_archived IS TRUE THEN
                    PERFORM PG_NOTIFY('main', JSON_BUILD_OBJECT(
                        'action', 'application_archived',
                        'id', NEW.id
                    )::text);
                END IF;
                RETURN NULL;
            END;
        `,
    },



    // ----------------------
    // Subscription changed
    // ----------------------

    {
        definition: `AFTER INSERT OR UPDATE OR DELETE ON subscriptions FOR EACH ROW`,
        function: `
            DECLARE
                var_plan INTEGER;
                var_company INTEGER;
            BEGIN
            
                IF TG_OP = 'DELETE' THEN
                    var_company := OLD.company;
                ELSE
                    var_company := NEW.company;
                END IF;
            
                SELECT value INTO var_plan
                FROM v_plans
                WHERE v_plans.company = var_company;
            
                IF var_plan IS NULL THEN
                    UPDATE jobs
                    SET premium = false, urgent = false
                    WHERE location IN (SELECT id FROM locations WHERE company = var_company);
                    
                ELSIF var_plan = 3 THEN
                    UPDATE jobs
                    SET premium = true
                    WHERE location IN (SELECT id FROM locations WHERE company = var_company);
                    
                END IF;
                RETURN NULL;
                
            END;
        `,
    },



    // ----------------------
    // Jobs keywords
    // ----------------------

    {
        definition: `AFTER INSERT OR UPDATE ON keywords_jobs FOR EACH ROW`,
        function: `
            BEGIN
                
                IF TG_OP = 'UPDATE' THEN
                    DELETE FROM jobs_keywords
                    WHERE keyword = OLD.id;
                END IF;
           
                INSERT INTO jobs_keywords (keyword, job)
                SELECT NEW.id AS keyword, jobs.id AS job
                FROM jobs
                WHERE 
                    jobs.title ILIKE '%' || NEW.value || '%' OR
                    jobs.content ILIKE '%' || NEW.value || '%';
        
                RETURN NEW;
            END;
        `,
    },

    {
        definition: `AFTER INSERT OR UPDATE of title, content ON jobs FOR EACH ROW`,
        function: `
            BEGIN
                
                IF TG_OP = 'UPDATE' THEN
                    DELETE FROM jobs_keywords
                    WHERE job = OLD.id;
                END IF;
           
                INSERT INTO jobs_keywords (keyword, job)
                SELECT keywords_jobs.id AS keyword, NEW.id AS job
                FROM keywords_jobs
                WHERE 
                    NEW.title ILIKE '%' || keywords_jobs.value || '%' OR
                    NEW.content ILIKE '%' || keywords_jobs.value || '%';
        
                RETURN NEW;
            END;
        `,
    }



]