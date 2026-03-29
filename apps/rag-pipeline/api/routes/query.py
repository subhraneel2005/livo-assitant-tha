from fastapi import APIRouter
from pydantic import BaseModel
from actions.embed import user_query_embed
from config.logger import logger
from actions.llm_answer import get_llm_response, build_context_str

router = APIRouter(prefix="/api", tags=["Rag"])

class QueryPayload(BaseModel):
    user_query: str

@router.post("/query")
async def query(payload: QueryPayload):
    try:
        user_query = payload.user_query
        logger.info(f"user query: {user_query}")
        results = user_query_embed(user_query)
        logger.info("top k results retieved")
       
        context = build_context_str(results.points)
        logger.info(f"----------------RESULTS--------------: {results.points}")
        llm_response = get_llm_response(context, query=user_query)

        return llm_response

    except Exception as e:
        logger.error(f"Error at /query: ${e}")
        raise


@router.get("/health")
async def status():
    return {
        "status": "ok"
    }