"""gunicorn WSGI server configuration"""
from multiprocessing import cpu_count

import gunicorn


def max_workers() -> int:
    # Thread count
    return cpu_count() * 2 + 1


# Restart gunicorn worker processes every 1200-1250 requests
max_requests = 1200
max_requests_jitter = 50

# Async worker
worker_class = 'gevent'
workers = max_workers()


# Replace gunicorn's 'Server' HTTP header to avoid leaking info to attackers
gunicorn.SERVER = ""

bind = "0.0.0.0:8000"
module = "backend.wsgi:application"

accesslog = "/app/logs/access.log"
errorlog = "/app/logs/error.log"