import requests
from dataclasses import dataclass, field
import json

import typer

@dataclass
class Admin_Instance:
	ip: str = field(init=False, default="127.0.0.1")
	port: str = field(init=False, default="8000")
	token: str = field(init=False, default="")
	url: str = field(init=False, default="")
	
	headers: dict = field(init=False, default_factory=dict)
	def __post_init__(self):
		self.url = f"http://{self.ip}:{self.port}"
		headers = {"Content-Type": "application/json"}
	
	def set_url(self, ip: str, port: str):
		self.ip = ip
		self.port = port
		self.url = f"http://{self.ip}:{self.port}"
		
	def login(self, username: str, password: str) -> str:
		response = requests.post(
			url=f"{self.url}/api/login", 
			headers=self.headers,
			data=json.dumps({"username": username, "password": password})
		)
		
		if response.status_code == 200:
			self.headers["Authorization"] = f"Token {response.json()['token']}"
		else:
			try:
				error_message = response.json()["non_field_errors"][0]
			except:
				error_message = response.text
			return f"Error logging in: {error_message}"
		
	
		
			
   
# CLI
app = typer.Typer()

admin_instance = Admin_Instance()

@app.command()
def login(username: str, password: str, ip: str, port: str):
	admin = admin_instance.login(username, password)
	print(admin.login(username, password))


if __name__ == "__main__":
	app()