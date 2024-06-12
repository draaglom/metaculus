from django_dynamic_fixture import G

from posts.models import Post
from questions.models import Question, Conditional, Forecast
from users.models import User
from utils.dtypes import setdefaults_not_null


def create_post(*, author: User = None, question: Question = None, conditional: Conditional = None, **kwargs):
    return G(
        Post,
        **setdefaults_not_null(
            kwargs,
            author=author,
            question=question,
            conditional=conditional,
        )
    )