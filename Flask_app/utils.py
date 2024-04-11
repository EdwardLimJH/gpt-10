''' 
#original Rag chat, works well but not sure why h2o.ai seems to be sufferring 
#from some cold start issue? so made a small workaround using their timeout
def rag_chat(client, chat_session_id, main_prompt, system_prompt):
    with client.connect(chat_session_id) as session:
        answer = session.query(
            message=main_prompt,
            system_prompt=system_prompt,
            rag_config={
            "rag_type": "rag", # https://h2oai.github.io/h2ogpte/getting_started.html#advanced-controls-for-document-q-a
            },
            llm="h2oai/h2ogpt-4096-llama2-70b-chat",
        )
        return answer
'''
def rag_chat(client, chat_session_id, main_prompt, system_prompt):
    counter = 1
    while True:
        print(f"Currently at count = {counter}")
        try:
            with client.connect(chat_session_id) as session:
                answer = session.query(
                    message=main_prompt,
                    system_prompt=system_prompt,
                    rag_config={
                    "rag_type": "rag", # https://h2oai.github.io/h2ogpte/getting_started.html#advanced-controls-for-document-q-a
                    },
                    llm="h2oai/h2ogpt-4096-llama2-70b-chat",
                    timeout=1 if counter < 3 else 120,
                )
                return answer
        except TimeoutError:
            counter += 1
            continue


def extract_json_string(full_string): 
    """Extracts json-like string from LLM response. Outputs str."""

    start_index = full_string.find('{')  # Find the index of the first '{'
    end_index = full_string.rfind('}')   # Find the index of the last '}'
    
    if start_index != -1 and end_index != -1:
        return full_string[start_index:end_index + 1]
    else:
        return None
