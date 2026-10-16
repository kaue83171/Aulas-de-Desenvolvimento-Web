


:- dynamic capacidade/1.


tunel(entrada, sala1, seco).
tunel(sala1, sala2, alagado).
tunel(sala2, saida, seco).
tunel(sala1, sala3, seco).
tunel(sala3, sala4, seco).
tunel(sala4, saida, seco).
tunel(entrada, sala5, seco).
tunel(sala5, saida, seco).

risco_desmoronamento(sala5).

% capacidade(aquatico).

conexao(A, B, Tipo) :- tunel(A, B, Tipo).
conexao(A, B, Tipo) :- tunel(B, A, Tipo).


pode_atravessar(seco).
pode_atravessar(alagado) :- capacidade(aquatico).


passo_seguro(A, B) :-
    conexao(A, B, Tipo),
    \+ risco_desmoronamento(B),
    pode_atravessar(Tipo).


rota_segura(Origem, Destino) :-
    rota_segura(Origem, Destino, _).


rota_segura(Origem, Destino, Caminho) :-
    buscar(Origem, Destino, [Origem], Caminho).


buscar(Destino, Destino, _, [Destino]).


buscar(Atual, Destino, Visitadas, [Atual | Resto]) :-
    passo_seguro(Atual, Proxima),
    \+ member(Proxima, Visitadas),
    buscar(Proxima, Destino, [Proxima | Visitadas], Resto).

