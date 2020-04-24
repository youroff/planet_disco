import networkx as nx
from node2vec import Node2Vec
import numpy as np
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA

def df_to_nxgraph(df):
    graph_csv = df.to_csv(sep=" ", index=False, header=False)
    with open("./genre_graph.csv", "w") as f:
        f.write(graph_csv)
    graph = nx.parse_edgelist(graph_csv.split("\n"), nodetype = int, data=(('weight',float),))
    return graph

def graph_embed(graph, dimensions):
    node2vec = Node2Vec(graph, dimensions=dimensions, walk_length=30, num_walks=200, workers=16)
    model = node2vec.fit(window=10, min_count=1, batch_words=4)
    return model

def extract_label_map_from_df(df):
    labels = df.to_dict(orient='records')
    label_map = {record['id']: record['name'] for record in labels}
    return label_map

def get_embeddings_with_labels(model, nodes, label_map):
    """Extract representations from the node2vec model"""
    embeddings = []
    labels = []
    for n in nodes:
        embeddings.append(list(model.wv.get_vector(n)))
        labels.append(label_map[int(n)])
        
    embeddings = np.array(embeddings)
    return embeddings, labels

def get_nodes(graph):
    nodes = [str(n) for n in graph.nodes]
    return nodes

def plot_embedding(emb, labels):
    plt.figure(figsize=(40,40))
    plt.scatter(emb[:, 0], emb[:, 1], cmap=plt.get_cmap('Spectral'))
    for coords, label in zip(emb, labels):
        try:
            x, y = coords[0], coords[1]
            plt.annotate(
                label,
                xy=(x, y), xytext=(-10, 10),
                textcoords='offset points', ha='right', va='bottom',
                bbox=dict(boxstyle='round,pad=0.4', fc='yellow', alpha=0.5),
                arrowprops=dict(arrowstyle = '->', connectionstyle='arc3,rad=0'))
        except:
            continue
#     plt.show()
    plt.savefig('embedding.png')
            
def tsne_embed(em):
    tsne = TSNE(n_components=2, perplexity=40)
    t_em = tsne.fit_transform(em)
    return t_em

def generate_embedding(graph_df, labels_df):
    g = df_to_nxgraph(graph_df)
    g_model = graph_embed(g, 40)
    label_map = extract_label_map_from_df(labels_df)
    nodes = get_nodes(g)
    em, labels = get_embeddings_with_labels(g_model, nodes, label_map)
    return em, labels

#def plot(em, labels):
#     g = df_to_nxgraph(graph_df)
#     g_model = graph_embed(g, 40)
#     label_map = extract_label_map_from_df(labels_df)
#     nodes = get_nodes(g)
#     em, labels = get_embeddings_with_labels(g_model, nodes, label_map)
#     em = tsne_embed(em)
#     plot_embedding(em, labels)
   
