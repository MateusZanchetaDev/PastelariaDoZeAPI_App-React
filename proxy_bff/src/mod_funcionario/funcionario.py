from flask import Blueprint, jsonify, request
from settings import API_ENDPOINT_FUNCIONARIO
from funcoes import Funcoes
import bcrypt  # 📌 Biblioteca para hashing de senha

bp_funcionario = Blueprint('funcionario', __name__, url_prefix="/api/funcionario")

# --- Rotas da API do Backend (que serão consumidas pelo React) ---

@bp_funcionario.route('/all', methods=['GET'])
def get_funcionarios():
    response_data, status_code = Funcoes.make_api_request('get', API_ENDPOINT_FUNCIONARIO)
    return jsonify(response_data), status_code

@bp_funcionario.route('/one', methods=['GET'])
def get_funcionario():
    id_funcionario = request.args.get('id_funcionario')
    if not id_funcionario:
        return jsonify({"error": "O parâmetro 'id_funcionario' é obrigatório"}), 400
    response_data, status_code = Funcoes.make_api_request('get', f"{API_ENDPOINT_FUNCIONARIO}{id_funcionario}")
    return jsonify(response_data), status_code

@bp_funcionario.route('/', methods=['POST'])
def create_funcionario():
    if not request.is_json:
        return jsonify({"error": "Requisição deve ser JSON"}), 400

    data = request.get_json()
    required_fields = ['nome', 'matricula', 'cpf', 'senha', 'grupo', 'telefone']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400

    # 🔒 Hash da senha
    senha_original = data['senha']
    senha_hash = bcrypt.hashpw(senha_original.encode('utf-8'), bcrypt.gensalt())
    data['senha'] = senha_hash.decode('utf-8')

    response_data, status_code = Funcoes.make_api_request('post', API_ENDPOINT_FUNCIONARIO, data=data)
    return jsonify(response_data), status_code

@bp_funcionario.route('/', methods=['PUT'])
def update_funcionario():
    if not request.is_json:
        return jsonify({"error": "Requisição deve ser JSON"}), 400

    data = request.get_json()
    required_fields = ['id_funcionario', 'nome', 'matricula', 'cpf', 'senha', 'grupo', 'telefone']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400

    # 🔒 Hash da nova senha (caso esteja sendo alterada)
    senha_original = data['senha']
    senha_hash = bcrypt.hashpw(senha_original.encode('utf-8'), bcrypt.gensalt())
    data['senha'] = senha_hash.decode('utf-8')

    response_data, status_code = Funcoes.make_api_request(
        'put',
        f"{API_ENDPOINT_FUNCIONARIO}{data.get('id_funcionario')}",
        data=data
    )
    return jsonify(response_data), status_code

@bp_funcionario.route('/', methods=['DELETE'])
def delete_funcionario():
    id_funcionario = request.args.get('id_funcionario')
    if not id_funcionario:
        return jsonify({"error": "O parâmetro 'id_funcionario' é obrigatório"}), 400
    response_data, status_code = Funcoes.make_api_request('delete', f"{API_ENDPOINT_FUNCIONARIO}{id_funcionario}")
    return jsonify(response_data), status_code

@bp_funcionario.route('/cpf', methods=['GET'])
def validate_cpf():
    cpf = request.args.get('cpf')
    if not cpf:
        return jsonify({"error": "O parâmetro 'cpf' é obrigatório"}), 400
    response_data, status_code = Funcoes.make_api_request('get', f"{API_ENDPOINT_FUNCIONARIO}cpf/{cpf}")
    return jsonify(response_data), status_code

@bp_funcionario.route('/login', methods=['POST'])
def validar_login():
    if not request.is_json:
        return jsonify({"error": "Requisição deve ser JSON"}), 400

    data = request.get_json()
    required_fields = ['cpf', 'senha']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400

    response_data, status_code = Funcoes.make_api_request('post', f"{API_ENDPOINT_FUNCIONARIO}login/", data=data)
    return jsonify(response_data), status_code
