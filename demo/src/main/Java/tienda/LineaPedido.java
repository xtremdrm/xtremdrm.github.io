package tienda;

public class LineaPedido {
    private int codigo;
    private int pedidoId; 
    private int productoId; 
    private int cantidad;

    // Constructor sin parámetros
    public LineaPedido() {
    }

    // Constructor con todos los parámetros
    public LineaPedido(int codigo, int pedidoId, int productoId, int cantidad) {
        this.codigo = codigo;
        this.pedidoId = pedidoId;
        this.productoId = productoId;
        this.cantidad = cantidad;
    }

    // Getter y Setter para el código
    public int getCodigo() {
        return codigo;
    }

    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }

    // Getter y Setter para el pedidoId
    public int getPedidoId() {
        return pedidoId;
    }

    public void setPedidoId(int pedidoId) {
        this.pedidoId = pedidoId;
    }

    // Getter y Setter para el productoId
    public int getProductoId() {
        return productoId;
    }

    public void setProductoId(int productoId) {
        this.productoId = productoId;
    }

    // Getter y Setter para la cantidad
    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
}
