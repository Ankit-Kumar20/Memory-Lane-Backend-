from .LLM import llm

def summary_generator(transcript)->str:
    result = llm.invoke(f"Generate summary for the following transcript: {transcript}")
    return result

def tags_generator(n_tags: int, summary: str)->str:
    result = llm.invoke(f"generate {n_tags} tagging words for the given summary: {summary}")
    return result