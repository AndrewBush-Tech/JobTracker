import sqlite3
import json
from datetime import datetime

DB_PATH = "../../jobfinder/jobs.db"
OUTPUT_FILE = "exported_jobs.json"

ENTRY_LEVEL_EXCLUDE = ["senior", "lead", "staff", "manager"]


def is_entry_level(title):
    title = title.lower()
    return not any(level in title for level in ENTRY_LEVEL_EXCLUDE)


def load_entry_level_jobs():
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT company, title, posted, link, tags, salary FROM jobs")
        rows = c.fetchall()
        conn.close()

        jobs = []
        for row in rows:
            company = row[0] or "Unknown"
            position = row[1] or "Untitled"
            posted_date = row[2]
            job_link = row[3]
            tags = row[4].split(",") if row[4] else []
            salary = row[5]

            if not is_entry_level(position):
                continue

            try:
                deadline = datetime.strptime(posted_date, "%Y-%m-%d").date().isoformat()
            except Exception:
                deadline = None

            jobs.append({
                "company": company,
                "position": position,
                "status": "Imported",
                "deadline": deadline,
                "jobLink": job_link,
                "tags": tags,
                "salary": salary
            })

        return jobs

    except Exception as e:
        print(f"❌ Error loading jobs: {e}")
        return []


def export_to_json(jobs):
    try:
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(jobs, f, indent=2)
        print(f"✅ Exported {len(jobs)} entry-level jobs to {OUTPUT_FILE}")
    except Exception as e:
        print(f"❌ Error writing JSON: {e}")


if __name__ == "__main__":
    entry_level_jobs = load_entry_level_jobs()
    export_to_json(entry_level_jobs)
